import React from "react";
import {Card, Col, Row} from "antd";
import {DrawTool} from "../../../types/GameModel";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";
import ToolPicker from "./ToolPicker";

interface DrawingToolTipsProps {
    clearCanvas: () => any,
    tool: DrawTool,
    setTool: (tool: DrawTool) => any,
    color: string,
    setColor: (color: string) => any,
    lineWidth: number,
    setLineWidth: (width: number) => any
}

const DrawingToolTips = ({
                             clearCanvas,
                             tool,
                             setTool,
                             color,
                             setColor,
                             lineWidth,
                             setLineWidth
                         }: DrawingToolTipsProps) => {

    return (
        <Card>
            <Row
                gutter={[20, 20]}
            >

                <Col xs={24} lg={12}>

                    <Row
                        gutter={[10, 20]}
                    >
                        <Col xs={24} xxl={12}>

                            <ToolPicker
                                currentTool={tool}
                                setTool={setTool}
                                clearCanvas={clearCanvas}
                            />
                        </Col>

                        <Col xs={24} xxl={12}>
                            <SizePicker
                                currentSize={lineWidth}
                                setSize={setLineWidth}
                                vertical={false}
                            />
                        </Col>
                    </Row>

                </Col>


                <Col xs={24} lg={12}>
                    <ColorPicker
                        currentColor={color}
                        setColor={setColor}
                        vertical={false}
                    />
                </Col>

            </Row>
        </Card>
    )
}

export default DrawingToolTips;