import React from "react";
import {Button, Card, Col, Divider, Row} from "antd";
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
    setLineWidth: (width: number) => any,
    vertical?: boolean
}

const DrawingToolTips = ({
                             clearCanvas,
                             tool,
                             setTool,
                             color,
                             setColor,
                             lineWidth,
                             setLineWidth,
                             vertical = true
                         }: DrawingToolTipsProps) => {

    return (
        <Card>
            {vertical ?
                <div
                    style={{height: '100%'}}
                >
                    <Button
                        icon={<DeleteOutlined/>}
                        style={{width: '100%'}}
                        danger
                        onClick={clearCanvas}
                    >
                        Clear all
                    </Button>
                    <Divider orientation="center">
                        Tool
                    </Divider>

                    <ToolPicker
                        currentTool={tool}
                        setTool={setTool}
                    />

                    <Divider orientation="center">
                        Size
                    </Divider>

                    <SizePicker
                        currentSize={lineWidth}
                        setSize={setLineWidth}
                    />

                    <Divider orientation="center">
                        Color
                    </Divider>

                    <ColorPicker
                        currentColor={color}
                        setColor={setColor}
                    />

                </div>
                :
                <Row>
                    <Col>
                        <Divider orientation="center">
                            Tool
                        </Divider>

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

                    <Col>
                        <Divider orientation="center">
                            Size
                        </Divider>

                        <SizePicker
                            currentSize={lineWidth}
                            setSize={setLineWidth}
                            vertical={false}
                        />
                    </Col>

                    <Col>
                        <Divider orientation="center">
                            Color
                        </Divider>

                        <ColorPicker
                            currentColor={color}
                            setColor={setColor}
                            vertical={false}
                        />
                    </Col>

                </Row>
            }

        </Card>
    )
}

export default DrawingToolTips;