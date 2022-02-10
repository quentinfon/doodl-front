import { Select } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Coordinate } from "../types/message";


const { Option } = Select;

const DrawingCanva = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mode, setMode] = useState<string>("brush");
    const [lineWidth, setlineWidth] = useState<number>(5);
    const [color, setColor] = useState<string>("black");

    const modeRef = useRef(mode);
    
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

        const coor = getCoordinates(evt);
        
        if (context) {
            context.lineTo(mouse.x, mouse.y);
            context.stroke();            
        }
    }

    const draw = () => {
        if (!canvasRef.current) return;
    
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext("2d");
        
        if (context) {
            let currentMode = modeRef.current;

            if (currentMode === 'fill') {
                context.fillStyle = color;
                (context as any).fillFlood(mouse.x, mouse.y);
            } else {
                if (currentMode === 'brush') {
                    context.globalCompositeOperation = "source-over";
                } else if (currentMode === 'eraser') {
                    context.globalCompositeOperation = "destination-out";
                }

                context.strokeStyle = color;
                context.lineWidth = lineWidth;
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

    const onPointerUp = () => {
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
            canvas.addEventListener('pointerup', onPointerUp, false);
        }
        
        return () => {
            let canvas = canvasRef.current;
            if(canvas){
                canvas.removeEventListener('pointermove', onMove, false);
                canvas.removeEventListener('pointerdown', onPointerDown, false);
                canvas.removeEventListener('pointerup', onPointerUp, false);
            }
            
        }

    }, [canvasRef])

    return(
        <>
            <div>

                <button onClick={clearCanva}>Clear</button>
                Tool:
                <Select 
                    value={mode}
                    onChange={(e: string) => {
                        modeRef.current = e;
                        setMode(e);
                    }}
                >
                    
                    <Option value="brush">Brush</Option>
                    <Option value="eraser">Eraser</Option>
                    <Option value="fill">Fill</Option>
                        
                </Select>
                <select id="color">

                </select>
                <div>
                    <input type="range" id="strokeWidth" min="1" max="50" value="5" step="1" />
                    <output>5</output>
                </div>

                <canvas ref={canvasRef} height="600" width="800"/>
              
            </div>

        </>
    )
}

export default DrawingCanva;