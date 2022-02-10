import React from "react";
import { HighlightOutlined, BgColorsOutlined, EditOutlined } from '@ant-design/icons';
import { Button, List, Menu, Typography } from "antd";

const { Title, Text } = Typography;

const { SubMenu } = Menu;

interface ToolPickerProps {
    currentTool: string,
    setTool: (tool: string) => any
}

const ToolPicker = ({
    currentTool,
    setTool
} : ToolPickerProps) => {

    interface ToolsListItem {
        toolName: string;
        toolIcon: any;
    }

    const tools : ToolsListItem[] = [
        {
            toolName: "brush",
            toolIcon: <HighlightOutlined className="canvasItemsIcon" />
        },
        {
            toolName: "fill",
            toolIcon: <BgColorsOutlined className="canvasItemsIcon" />
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