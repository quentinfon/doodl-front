import { Select } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface Coordinate {
    x: number;
    y: number;
}

const { Option } = Select;

const DrawingCanva = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mode, setMode] = useState<string>("brush");
    const [lineWidth, setlineWidth] = useState<number>(5);
    const [color, setColor] = useState<string>("black");
    const [isPainting, setIsPainting] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);

    const clearCanva = () => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext("2d");

        if(context){
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    const getCoordinates = (event: MouseEvent): Coordinate | undefined => {

        if (!canvasRef.current) return;

        const canvas: HTMLCanvasElement = canvasRef.current;
        var rect = canvas.getBoundingClientRect();

        return {x:event.pageX - rect.left, y:event.pageY - rect.top};
    }


    const startPaint = useCallback((event: MouseEvent) => {
        const coordinates = getCoordinates(event);
        
        if (coordinates) {
            setIsPainting(true);
            setMousePosition(coordinates);
        }
    }, []);   

    useEffect(() => {

        if (!canvasRef.current) return;
        
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener("mousedown", startPaint);
        
        return () => {
            canvas.removeEventListener("mousedown", startPaint);
        };
        
    }, [startPaint]);


    const paint = useCallback((event: MouseEvent) => {        
        if (isPainting) {
        
            const newMousePosition = getCoordinates(event);

            if (mousePosition && newMousePosition) {
                drawLine(mousePosition, newMousePosition);
                setMousePosition(newMousePosition);
            }
        
        }
    }, [isPainting, mousePosition]);
            
    
    const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
        
        if (!canvasRef.current) return;
        
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext("2d");
        
        if (context) {
        
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            context.lineJoin = "round";
    
    
            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();
    
            context.stroke();
        }
    };

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener("mousemove", paint);
        
        return () => {
            canvas.removeEventListener("mousemove", paint);
        };
        
    }, [paint]);


    const exitPaint = useCallback(() => {
        setIsPainting(false);
    }, []);

    useEffect(() => {

        if (!canvasRef.current) return;
        
        const canvas: HTMLCanvasElement = canvasRef.current;

        canvas.addEventListener("mouseup", exitPaint);
        canvas.addEventListener("mouseleave", exitPaint);
        
        return () => {
            canvas.removeEventListener("mouseup", exitPaint);        
            canvas.removeEventListener("mouseleave", exitPaint);
        };
        
    }, [exitPaint]);

    useEffect(() => {
        clearCanva();
        //Todo Init to current dessins
    }, [canvasRef])

    return(
        <>
            <div>

                <button onClick={clearCanva}>Clear</button>
                Tool:
                <Select 
                    value={mode}
                    onChange={(e: string) => setMode(e)}
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