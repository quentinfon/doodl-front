import React from "react";
import { Stage, Layer, Line, Text, Rect } from 'react-konva';

interface CanvasLine {
    points: number [],
    tool: string
}

const DrawingCanva = () => {

    const [tool, setTool] = React.useState<string>('pen');
    const [lines, setLines] = React.useState<CanvasLine[]>([]);
    const isDrawing = React.useRef(false);

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e: any) => {
        // no drawing - skipping
        if (!isDrawing.current) {
        return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    return(
        <>
            <div
                style={{
                    background: "#fff",
                    width: "100%",
                    height: "100%"
                }}
            >
                <Stage
                    width={800}
                    height={600}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseup={handleMouseUp}
                >
                    <Layer>
                        {lines.map((line, i) => (
                            <Line
                            key={i}
                            points={line.points}
                            stroke="#df4b26"
                            strokeWidth={5}
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation={
                                line.tool === 'eraser' ? 'destination-out' : 'source-over'
                            }
                            />
                        ))}
                    </Layer>
                </Stage>
                <select
                    value={tool}
                    onChange={(e) => {
                    setTool(e.target.value);
                    }}
                >
                    <option value="pen">Pen</option>
                    <option value="eraser">Eraser</option>
                </select>
            </div>

        </>
    )
}

export default DrawingCanva;