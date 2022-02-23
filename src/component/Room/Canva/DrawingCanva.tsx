import React, {ForwardedRef, forwardRef, MutableRefObject, useEffect, useImperativeHandle, useRef} from "react";
import {DrawTool, ICoordinate, IDraw, IPlayer} from "../../../types/GameModel";
import FloodFill from 'q-floodfill'
import {
    GameSocketChannel,
    IDataDrawResponse,
    ISocketMessageRequest,
    ISocketMessageResponse
} from "../../../types/GameSocketModel";

export interface canvasFunctions {
    clear: () => any,
    forceClear: () => any
}

interface DrawingCanvaProps {
    initDraw: IDraw[],
    webSocket: WebSocket,
    player: IPlayer | undefined,
    modeRef: MutableRefObject<any>,
    lineWidthRef: MutableRefObject<any>,
    colorRef: MutableRefObject<any>,
    canDraw: MutableRefObject<boolean>,
    disabled: boolean,
    disabledDisplay: any
}

const DrawingCanva = forwardRef(({
                                     initDraw,
                                     webSocket,
                                     player,
                                     modeRef,
                                     lineWidthRef,
                                     colorRef,
                                     canDraw,
                                     disabled,
                                     disabledDisplay
                                 }: DrawingCanvaProps
    , ref: ForwardedRef<canvasFunctions>) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
        clear() {
            if (canDraw.current)
                clearCanva();
        },

        forceClear() {
            clearCanva();
        }
    }));

    const canvasSize = {height: 600, width: 800};
    const pointerTo: ICoordinate = {x: 0, y: 0};
    const pointerFrom: ICoordinate = {x: 0, y: 0};
    let drawing: boolean = false;

    const onDrawReceived = (event: any) => {
        const msg: ISocketMessageResponse = JSON.parse(event.data);
        if (!canvasRef.current || msg.channel !== GameSocketChannel.DRAW) return;

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
            channel: GameSocketChannel.DRAW,
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
        const canvas = canvasRef.current;
        if (!canvas) return;

        return {
            x: event.offsetX / (canvas.clientWidth / canvasSize.width),
            y: event.offsetY / (canvas.clientHeight / canvasSize.height)
        };
    }

    const draw = (data: IDraw, clientSide: boolean) => {
        if (!canvasRef.current || (clientSide && !drawing) || (clientSide && !canDraw.current)) return;

        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
            if (data.tool === DrawTool.CLEAR) {
                clearCanva();
            } else if (data.tool === DrawTool.FILL) {
                if (!data.coordsTo || !data.color) return;

                const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
                const floodFill = new FloodFill(imgData);
                floodFill.fill(data.color, Math.round(data.coordsTo.x), Math.round(data.coordsTo.y), 50);
                context.putImageData(floodFill.imageData, 0, 0);

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
        if (!coords) return;

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
        if (!coords) return;

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
            window.addEventListener('pointerup', stopDrawing, false);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('pointerdown', onPointerDown, false);
                canvas.removeEventListener('pointermove', onMove, false);
                window.removeEventListener('pointerup', stopDrawing, false);
            }
        }
    }, [canvasRef])

    useEffect(() => {
        initDraw.forEach((data: IDraw) => {
            draw(data, false);
        });
    }, [initDraw]);

    return (
        <div
            style={{
                position: "relative"
            }}
        >
            <canvas
                ref={canvasRef}
                height={canvasSize.height}
                width={canvasSize.width}
                style={{
                    width: "100%",
                    zIndex: "1"
                }}/>

            <div
                style={{
                    position: "absolute",
                    background: disabled ? "rgba(0,0,0,0.8)" : "",
                    width: "100%",
                    height: "99%",
                    top: "0",
                    left: "0",
                    zIndex: "2",
                    alignItems: "center"
                }}
            />

            {disabled &&
                <div
                    style={{
                        position: "absolute",
                        margin: "0",
                        top: "50%",
                        left: "50%",
                        zIndex: "3",
                        msTransform: "translate(-50%, -50%)",
                        transform: "translate(-50%, -50%)"
                    }}>
                    {disabledDisplay}
                </div>
            }

        </div>
    )
})

export default DrawingCanva;