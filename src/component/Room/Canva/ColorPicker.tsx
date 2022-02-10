import React from "react";
import { HighlightOutlined, BgColorsOutlined, EditOutlined } from '@ant-design/icons';
import { Button, List, Menu, Typography } from "antd";

const { Title, Text } = Typography;

const { SubMenu } = Menu;

interface ColorPickerProps {
    currentColor: string,
    setColor: (color: string) => any
}

const ColorPicker = ({
    currentColor,
    setColor
} : ColorPickerProps) => {

    const colors : string[] = [
        "#000000",
        "#FF1700",
        "#FF8E00",
        "#FFE400",
        "#1572A1",
        "#270082",
        "#632626",
        "#F3C5C5",
        "#E7FBBE",
        "#F9D371",
        "#3FA796",
        "#406882",
        "#F2789F",
        "#064635",
        "#9A0680",
        "#3D0000"
    ];

    return (
        <>

            <List 
                grid={{
                    gutter: 16,
                    column: 4,
                  }}
                dataSource={colors}
                renderItem={color => (
                    <List.Item
                        className="canvasItem"
                        onClick={() => setColor(color)}
                        style={{
                            cursor: 'pointer',
                            padding: '5px',
                            margin: '0'
                        }}
                    >
                        <svg viewBox="0 0 100 100">
                            <rect x="0" y="0" width="100" height="100" rx="15" ry="15" 
                                fill={color} 
                                opacity={currentColor === color ? 1 : 0.3}
                            />
                        </svg>
                    </List.Item>
                )}
            />
           
        </>
    )
}

export default ColorPicker;