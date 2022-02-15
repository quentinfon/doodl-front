import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Divider, Layout, Menu, message, Row, Select, Grid } from "antd";
import { ICoordinate, DrawTool, IDraw, IPlayer } from "../../../types/GameModel";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";
import ToolPicker from "./ToolPicker";
import { IDataDrawResponse, ISocketMessageRequest, ISocketMessageResponse, SocketChannel } from "../../../types/SocketModel";
import DrawingToolTips from "./DrawingToolTips";

const { Content, Sider } = Layout;
const { Option } = Select;
const { useBreakpoint } = Grid;

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
    console.log(screens);

    const [mode, setMode] = useState<DrawTool>(DrawTool.BRUSH);
    const [lineWidth, setlineWidth] = useState<number>(10);
    const [color, setColor] = useState<string>("#000000");

    const modeRef = useRef(mode);
    const lineWidthRef = useRef(lineWidth);
    const colorRef = useRef(color);

    const canvasSize = { height: 600, width: 800 };
    let mouse: ICoordinate = { x: 0, y: 0 };
    let mouseFrom: ICoordinate = { x: 0, y: 0 };
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

    const getCoordinates = (event: PointerEvent): ICoordinate | undefined => {
        return { x: event.offsetX, y: event.offsetY };
    }


    /*
    const onMove = (evt: PointerEvent) => {
        if (!canvasRef.current) return;

        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext("2d");

        if (context) {
            context.lineTo(mouse.x, mouse.y);
            context.stroke();

            sendDrawData({
                tool: modeRef.current as DrawTool,
                coordsFrom: { x: mouseFrom.x, y: mouseFrom.y },
                coordsTo: { x: mouse.x, y: mouse.y },
                color: colorRef.current,
                lineWidth: lineWidthRef.current
            });

            mouseFrom.x = mouse.x;
            mouseFrom.y = mouse.y;
        }
    }*/

    const draw = (data: IDraw, clientSide: boolean) => {
        if (!canvasRef.current) return;

        if (clientSide && !drawing) return;

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

                context.beginPath();
                context.lineWidth = data.lineWidth ?? 5;
                context.lineJoin = "round";
                context.moveTo(data.coordsFrom.x, data.coordsFrom.y);
                context.lineTo(data.coordsTo.x, data.coordsTo.y);
                context.closePath();
                context.stroke();

                if (clientSide) {
                    sendDrawData(data);
                    mouseFrom.x = data.coordsTo.x;
                    mouseFrom.y = data.coordsTo.y;
                }

            }
        }
    }

    const onMove = (evt: PointerEvent) => {
        mouseFrom.x = mouse.x;
        mouseFrom.y = mouse.y;

        let coor = getCoordinates(evt);
        mouse.x = coor?.x ?? 0;
        mouse.y = coor?.y ?? 0;

        draw({
            tool: modeRef.current,
            coordsFrom: mouseFrom,
            coordsTo: mouse,
            color: colorRef.current,
            lineWidth: lineWidthRef.current
        }, true);
    }

    const onPointerDown = (evt: PointerEvent) => {
        drawing = true;
        let coor = getCoordinates(evt);
        mouse.x = coor?.x ?? 0;
        mouse.y = coor?.y ?? 0;

        draw({
            tool: modeRef.current,
            coordsFrom: mouseFrom,
            coordsTo: mouse,
            color: colorRef.current,
            lineWidth: lineWidthRef.current
        }, true);
    }

    const stopDrawing = () => {
        drawing = false;
    }

    useEffect(() => {
        clearCanva();

        let canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('pointermove', onMove, false);
            canvas.addEventListener('pointerdown', onPointerDown, false);
            canvas.addEventListener('pointerup', stopDrawing, false);
            canvas.addEventListener('pointerleave', stopDrawing, false);
        }

        return () => {
            let canvas = canvasRef.current;
            if (canvas) {
                canvas.removeEventListener('pointermove', onMove, false);
                canvas.removeEventListener('pointerdown', onPointerDown, false);
                canvas.removeEventListener('pointerup', stopDrawing, false);
                canvas.addEventListener('pointerleave', stopDrawing, false);
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
                                    sendDrawData({ tool: DrawTool.CLEAR });
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
                                    setlineWidth(s);
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