import React from "react";
import {BgColorsOutlined, ClearOutlined, HighlightOutlined} from '@ant-design/icons';
import {List, Typography} from "antd";
import {DrawTool} from "../../../types/GameModel";

const {Title} = Typography;

interface ToolPickerProps {
    currentTool: DrawTool,
    setTool: (tool: DrawTool) => any
}

const ToolPicker = ({
                        currentTool,
                        setTool
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
            toolIcon: <ClearOutlined className="canvasItemsIcon"/>
        }
    ]

    return (
        <>

            <List
                itemLayout="horizontal"
                dataSource={tools}
                renderItem={item => (
                    <List.Item
                        className="canvasItem"
                        onClick={() => setTool(item.toolName)}
                        style={{
                            cursor: 'pointer',
                            background: currentTool === item.toolName ? '#D1D1D1' : ''
                        }}
                    >
                        <Title level={5} style={{margin: '0'}}>
                            {item.toolIcon} {item.toolName.charAt(0).toUpperCase() + item.toolName.slice(1).toLowerCase()}
                        </Title>
                    </List.Item>
                )}
            />

        </>
    )
}

export default ToolPicker;