import React, {useEffect, useRef, useState} from "react";
import {Col, Grid, Row} from "antd";
import {DrawTool, ICoordinate, IDraw, IPlayer} from "../../../types/GameModel";
import {
    IDataDrawResponse,
    ISocketMessageRequest,
    ISocketMessageResponse,
    SocketChannel
} from "../../../types/SocketModel";
import DrawingToolTips from "./DrawingToolTips";

const {useBreakpoint} = Grid;

interface DrawingCanvaProps {
    initDraw: IDraw[],
    webSocket: WebSocket,
    player: IPlayer | undefined
}

const DrawingCanva = ({
                          initDraw,
                          webSocket,
                          player
                      }: DrawingCanvaProps) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const screens = useBreakpoint();

    const [mode, setMode] = useState<DrawTool>(DrawTool.BRUSH);
    const [lineWidth, setLineWidth] = useState<number>(10);
    const [color, setColor] = useState<string>("#000000");

    const modeRef = useRef(mode);
    const lineWidthRef = useRef(lineWidth);
    const colorRef = useRef(color);

    const canvasSize = {height: 600, width: 800};
    const pointerTo: ICoordinate = {x: 0, y: 0};
    const pointerFrom: ICoordinate = {x: 0, y: 0};
    let drawing: boolean = false;

    const onDrawReceived = (event: any) => {
        const msg: ISocketMessageResponse = JSON.parse(event.data);
        if (!canvasRef.current || msg.channel !== SocketChannel.DRAW) return;

        const data: IDataDrawResponse = msg.data as IDataDrawResponse;
        if (!data) return;

        if (data.draftsman.playerId !== player?.playerId) {
            draw(data, false);
        }
    }

    useEffect(() => {
        webSocket.addEventListener("message", onDrawReceived);

        return (() => {
            webSocket.removeEventListener("message", onDrawReceived);
        })
    }, [webSocket]);

    const sendDrawData = (drawData: IDraw) => {
        const message: ISocketMessageRequest = {
            channel: SocketChannel.DRAW,
            data: drawData
        }

        webSocket?.send(JSON.stringify(message))
    }

    const clearCanva = () => {
        if (!canvasRef.current) return;

        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    const getCoordinates = (event: PointerEvent): ICoordinate => {
        return {x: event.offsetX, y: event.offsetY};
    }

    const draw = (data: IDraw, clientSide: boolean) => {
        if (!canvasRef.current || (clientSide && !drawing)) return;

        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
            if (data.tool === DrawTool.CLEAR) {
                clearCanva();
            } else if (data.tool === DrawTool.FILL) {
                if (!data.coordsTo || !data.color) return;
                context.fillStyle = data.color;
                (context as any).fillFlood(data.coordsTo.x, data.coordsTo.y);

                if (clientSide) {
                    sendDrawData(data);
                }
            } else {
                if (!data.coordsFrom || !data.coordsTo) return;

                if (data.tool === DrawTool.ERASER) {
                    context.strokeStyle = "white";
                } else {
                    context.strokeStyle = data.color ?? "";
                }

                // Fix mobile issue
                if (data.coordsTo.x === data.coordsFrom.x && data.coordsTo.y === data.coordsFrom.y) {
                    data.coordsTo.x -= 0.001;
                    data.coordsTo.y -= 0.001;
                }

                context.beginPath();
                context.lineWidth = data.lineWidth ?? 5;
                context.lineJoin = "round";
                context.moveTo(data.coordsFrom.x, data.coordsFrom.y);
                context.lineTo(data.coordsTo.x, data.coordsTo.y);
                context.closePath();
                context.stroke();

                if (clientSide) {
                    sendDrawData(data);
                    pointerFrom.x = data.coordsTo.x;
                    pointerFrom.y = data.coordsTo.y;
                }
            }
        }
    }

    const onMove = (evt: PointerEvent) => {
        evt.preventDefault();

        pointerFrom.x = pointerTo.x;
        pointerFrom.y = pointerTo.y;

        const coords = getCoordinates(evt);
        pointerTo.x = coords.x;
        pointerTo.y = coords.y;

        draw({
            tool: modeRef.current,
            coordsFrom: pointerFrom,
            coordsTo: pointerTo,
            color: colorRef.current,
            lineWidth: lineWidthRef.current
        }, true);
    }

    const onPointerDown = (evt: PointerEvent) => {
        evt.preventDefault();

        const coords = getCoordinates(evt);
        pointerTo.x = coords.x;
        pointerTo.y = coords.y;
        pointerFrom.x = pointerTo.x;
        pointerFrom.y = pointerTo.y;

        drawing = true;
        draw({
            tool: modeRef.current,
            coordsFrom: pointerFrom,
            coordsTo: pointerTo,
            color: colorRef.current,
            lineWidth: lineWidthRef.current
        }, true);
    }

    const stopDrawing = () => {
        drawing = false;
    }

    useEffect(() => {
        clearCanva();

        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('pointerdown', onPointerDown, false);
            canvas.addEventListener('pointermove', onMove, false);
            canvas.addEventListener('pointerup', stopDrawing, false);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('pointerdown', onPointerDown, false);
                canvas.removeEventListener('pointermove', onMove, false);
                canvas.removeEventListener('pointerup', stopDrawing, false);
            }
        }
    }, [canvasRef])

    useEffect(() => {
        initDraw.forEach((data: IDraw) => {
            draw(data, false);
        })
    }, [initDraw]);

    return (
        <>
            <div>
                <Row>
                    {!(screens.md && !screens.lg) &&
                        <Col md={6} xl={4}>
                            <DrawingToolTips
                                clearCanvas={() => {
                                    sendDrawData({tool: DrawTool.CLEAR});
                                    clearCanva();
                                }}
                                tool={mode}
                                setTool={(t: DrawTool) => {
                                    modeRef.current = t;
                                    setMode(t);
                                }}
                                color={color}
                                setColor={(c: string) => {
                                    colorRef.current = c;
                                    setColor(c);
                                }}
                                lineWidth={lineWidth}
                                setLineWidth={(s: number) => {
                                    lineWidthRef.current = s;
                                    setLineWidth(s);
                                }}
                            />
                        </Col>
                    }

                    <Col md={24} xl={20}>
                        <canvas
                            ref={canvasRef}
                            height={canvasSize.height}
                            width={canvasSize.width}
                        />
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default DrawingCanva;