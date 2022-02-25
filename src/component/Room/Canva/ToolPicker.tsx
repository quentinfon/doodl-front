import React from "react";
import {BgColorsOutlined, DeleteOutlined, HighlightOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Button, Col, Popconfirm, Row} from "antd";
import {DrawTool} from "../../../types/GameModel";

import eraserUrl from '/eraser.svg';

interface ToolPickerProps {
    currentTool: DrawTool,
    setTool: (tool: DrawTool) => any,
    clearCanvas: () => any
}

const ToolPicker = ({
                        currentTool,
                        setTool,
                        clearCanvas
                    }: ToolPickerProps) => {

    interface ToolsListItem {
        toolName: DrawTool;
        toolIcon: any;
    }

    const tools: ToolsListItem[] = [
        {
            toolName: DrawTool.BRUSH,
            toolIcon: <HighlightOutlined className="canvasItemsIcon"/>
        },
        {
            toolName: DrawTool.FILL,
            toolIcon: <BgColorsOutlined className="canvasItemsIcon"/>
        },
        {
            toolName: DrawTool.ERASER,
            toolIcon: <span role="img" aria-label="bg-colors" className="anticon anticon-bg-colors canvasItemsIcon">
                <img src={eraserUrl} style={{maxWidth: "100%"}} alt={"Eraser icon"}/>
            </span>
        }
    ]

    return (
        <>

            <Row
                gutter={[15, 15]}
                justify={"center"}
            >
                <Col xs={6}
                     style={{textAlign: "center"}}
                >
                    <Popconfirm title="Are you sure？" icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                onConfirm={clearCanvas}
                    >
                        <Button
                            icon={<DeleteOutlined/>}
                            type="primary"
                            shape="circle"
                            size={"large"}
                            danger
                        />
                    </Popconfirm>
                </Col>
                {tools.map((tool: ToolsListItem, index: number) => {
                    return (
                        <Col xs={6}
                             style={{textAlign: "center"}}
                             key={index}
                        >

                            <Button
                                type={currentTool === tool.toolName ? "primary" : "default"}
                                shape="circle"
                                size={"large"}
                                icon={tool.toolIcon}
                                onClick={() => setTool(tool.toolName)}
                            />

                        </Col>
                    )
                })}
            </Row>

        </>
    )
}

export default ToolPicker;