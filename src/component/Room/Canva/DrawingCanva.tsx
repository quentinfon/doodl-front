import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Divider, Layout, Menu, message, Row, Select } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { ICoordinate, DrawTool, IDraw, IPlayer } from "../../../types/GameModel";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";
import ToolPicker from "./ToolPicker";
import { IDataDrawResponse, ISocketMessageRequest, ISocketMessageResponse, SocketChannel } from "../../../types/SocketModel";

const { Content, Sider } = Layout;
const { Option } = Select;

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

    const [mode, setMode] = useState<DrawTool>(DrawTool.BRUSH);
    const [lineWidth, setlineWidth] = useState<number>(10);
    const [color, setColor] = useState<string>("black");

    const modeRef = useRef(mode);
    const lineWidthRef = useRef(lineWidth);
    const colorRef = useRef(color);

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
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
    }

    let mouse: ICoordinate = {
        x: 0,
        y: 0
    }

    let mouseFrom: ICoordinate = {
        x: 0,
        y: 0
    }

    const onPaint = (evt: PointerEvent) => {
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
    }

    const draw = (data: IDraw, clientSide: boolean) => {
        //console.log(data);
        if (!canvasRef.current) return;

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
                    sendDrawData({
                        tool: DrawTool.FILL,
                        color: data.color,
                        coordsTo: data.coordsTo
                    })
                }
            } else {
                if (data.tool === DrawTool.BRUSH) {
                    context.globalCompositeOperation = "source-over";
                } else if (data.tool === DrawTool.ERASER) {
                    context.globalCompositeOperation = "destination-out";
                }

                if (!data.coordsFrom || !data.coordsTo) return;

                context.beginPath();
                context.strokeStyle = data.color ?? "";
                context.lineWidth = data.lineWidth ?? 5;
                context.lineJoin = "round";
                context.moveTo(data.coordsFrom.x, data.coordsFrom.y);

                if (clientSide) {
                    context.closePath();
                    canvas.addEventListener("pointermove", onPaint, false);
                } else {
                    if (!data.coordsTo) return;
                    context.lineTo(data.coordsTo.x, data.coordsTo.y);
                    context.closePath();
                    context.stroke();
                }
            }
        }
    }

    const onMove = (evt: PointerEvent) => {
        let coor = getCoordinates(evt);
        mouse.x = coor?.x ?? 0;
        mouse.y = coor?.y ?? 0;
    }

    const onPointerDown = (evt: PointerEvent) => {
        let coor = getCoordinates(evt);
        mouse.x = coor?.x ?? 0;
        mouse.y = coor?.y ?? 0;

        mouseFrom.x = coor?.x ?? 0;
        mouseFrom.y = coor?.y ?? 0;

        draw({
            tool: modeRef.current,
            coordsFrom: mouse,
            coordsTo: mouse,
            color: colorRef.current,
            lineWidth: lineWidthRef.current
        }, true);
    }

    const removeEvent = () => {
        let canvas = canvasRef.current;
        if (canvas) {
            canvas.removeEventListener('pointermove', onPaint, false);
        }
    }

    useEffect(() => {
        clearCanva();

        let canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('pointermove', onMove, false);
            canvas.addEventListener('pointerdown', onPointerDown, false);
            canvas.addEventListener('pointerup', removeEvent, false);
            canvas.addEventListener('pointerleave', removeEvent, false);
        }

        return () => {
            let canvas = canvasRef.current;
            if (canvas) {
                canvas.removeEventListener('pointermove', onMove, false);
                canvas.removeEventListener('pointerdown', onPointerDown, false);
                canvas.removeEventListener('pointerup', removeEvent, false);
                canvas.addEventListener('pointerleave', removeEvent, false);
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
                    <Col span={6}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[mode]}
                            style={{ height: '100%' }}
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                style={{ width: '100%' }}
                                danger
                                onClick={() => {
                                    sendDrawData({ tool: DrawTool.CLEAR });
                                    clearCanva();
                                }}
                            >
                                Clear all
                            </Button>
                            <Divider orientation="center">
                                Tool
                            </Divider>

                            <ToolPicker
                                currentTool={mode}
                                setTool={(t: DrawTool) => {
                                    modeRef.current = t;
                                    setMode(t);
                                }}
                            />

                            <Divider orientation="center">
                                Size
                            </Divider>

                            <SizePicker
                                currentSize={lineWidth}
                                setSize={(s: number) => {
                                    lineWidthRef.current = s;
                                    setlineWidth(s);
                                }}
                            />

                            <Divider orientation="center">
                                Color
                            </Divider>

                            <ColorPicker
                                currentColor={color}
                                setColor={(c: string) => {
                                    colorRef.current = c;
                                    setColor(c);
                                }}
                            />

                        </Menu>
                    </Col>
                    <Col span={18}>
                        <canvas ref={canvasRef} height="600" width="800" />
                    </Col>
                </Row>




            </div>

        </>
    )
}

export default DrawingCanva;