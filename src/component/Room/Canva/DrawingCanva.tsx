import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Layout, Menu, Select } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { Coordinate, DrawTool, IDraw } from "../../../types/game";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";
import ToolPicker from "./ToolPicker";
import { ISocketMessageRequest, SocketChannel } from "../../../types/message";

const { Content, Sider } = Layout;
const { Option } = Select;

interface DrawingCanvaProps {
    webSocket: WebSocket
}

const DrawingCanva = ({
    webSocket
}: DrawingCanvaProps) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mode, setMode] = useState<string>("brush");
    const [lineWidth, setlineWidth] = useState<number>(10);
    const [color, setColor] = useState<string>("black");

    const modeRef = useRef(mode);
    const lineWidthRef = useRef(lineWidth);
    const colorRef = useRef(color);

    const onDrawReceived = (event: any) => {
        console.log(event);
    }

    useEffect(() => {
        webSocket.addEventListener("message", onDrawReceived);

        return(() => {
            webSocket.removeEventListener("message", onDrawReceived);
        })
    }, [webSocket]);

    const sendDrawData = (drawData: IDraw) => {
        let message: ISocketMessageRequest = {
            channel: SocketChannel.DRAW,
            data: drawData
        }
        
        webSocket?.send(JSON.stringify(message))
    }
    
    const clearCanva = () => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext("2d");

        if(context){
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    const getCoordinates = (event: PointerEvent): Coordinate | undefined => {

        if (!canvasRef.current) return;

        const canvas: HTMLCanvasElement = canvasRef.current;
        var rect = canvas.getBoundingClientRect();

        return {x:event.pageX - rect.left, y:event.pageY - rect.top};
    }

    let mouse : Coordinate = {
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
                coords: {x: mouse.x, y: mouse.y},
                color: colorRef.current,
                lineWidth: lineWidthRef.current
            });
        }
    }

    const draw = () => {
        if (!canvasRef.current) return;
    
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext("2d");
        
        if (context) {
            let currentMode = modeRef.current;

            if (currentMode === DrawTool.FILL) {
                context.fillStyle = colorRef.current;
                (context as any).fillFlood(mouse.x, mouse.y);
            } else {
                if (currentMode === DrawTool.BRUSH) {
                    context.globalCompositeOperation = "source-over";
                } else if (currentMode === DrawTool.ERASER) {
                    context.globalCompositeOperation = "destination-out";
                }

                context.strokeStyle = colorRef.current;
                context.lineWidth = lineWidthRef.current;
                context.lineJoin = "round";

                context.beginPath();
                context.moveTo(mouse.x, mouse.y);
                context.closePath();

                canvas.addEventListener("pointermove", onPaint, false);

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
        draw();
    }

    const removeEvent = () => {
        let canvas = canvasRef.current;
        if (canvas){
            canvas.removeEventListener('pointermove', onPaint, false);
        }
    }

    useEffect(() => {
        clearCanva();

        let canvas = canvasRef.current;
        if (canvas){
            canvas.addEventListener('pointermove', onMove, false);        
            canvas.addEventListener('pointerdown', onPointerDown, false);        
            canvas.addEventListener('pointerup', removeEvent, false);
            canvas.addEventListener('pointerleave', removeEvent, false);
        }
        
        return () => {
            let canvas = canvasRef.current;
            if(canvas){
                canvas.removeEventListener('pointermove', onMove, false);
                canvas.removeEventListener('pointerdown', onPointerDown, false);
                canvas.removeEventListener('pointerup', removeEvent, false);
                canvas.addEventListener('pointerleave', removeEvent, false);
            }
            
        }

    }, [canvasRef])

    return(
        <>
            <div>
                
                <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
                    <Sider className="site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[mode]}
                            style={{ height: '100%' }}
                        >
                            <Button 
                                icon={<DeleteOutlined />}
                                style={{width: '100%'}}
                                danger
                                onClick={clearCanva}
                            >
                                Clear all
                            </Button>
                            <Divider orientation="center">
                                Tool
                            </Divider>
                            
                            <ToolPicker 
                                currentTool={mode}
                                setTool={(t: string) => {
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
                    </Sider>
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        <canvas ref={canvasRef} height="600" width="800"/>
                    </Content>
                </Layout>


               
              
            </div>

        </>
    )
}

export default DrawingCanva;