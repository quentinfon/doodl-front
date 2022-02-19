import React from "react";
import {Button, Card, Col, Row} from "antd";
import {DrawTool} from "../../../types/GameModel";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";
import ToolPicker from "./ToolPicker";
import {DeleteOutlined} from '@ant-design/icons';

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
            <Row>
                <Col xs={24} md={12} lg={6}>
                    <Button
                        icon={<DeleteOutlined/>}
                        style={{width: '100%'}}
                        danger
                        onClick={clearCanvas}
                    >
                        Clear all
                    </Button>

                    <ToolPicker
                        currentTool={tool}
                        setTool={setTool}
                    />
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <SizePicker
                        currentSize={lineWidth}
                        setSize={setLineWidth}
                        vertical={false}
                    />
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