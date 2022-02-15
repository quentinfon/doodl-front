import React from "react";
import {List} from "antd";


interface SizePickerProps {
    currentSize: number,
    setSize: (size: number) => any
}

const SizePicker = ({
                        currentSize,
                        setSize
                    }: SizePickerProps) => {
    const tools: number[] = [5, 10, 25, 50]

    return (
        <>
            <List
                grid={{
                    gutter: 16,
                    column: 4,
                }}
                dataSource={tools}
                renderItem={s => (
                    <List.Item
                        className="canvasItem"
                        onClick={() => setSize(s)}
                        style={{
                            cursor: 'pointer',
                            padding: '5px',
                            margin: '0'
                        }}
                    >

                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r={s} fill={currentSize === s ? "#000000" : "#D1D1D1"}/>
                        </svg>

                    </List.Item>
                )}
            />
        </>
    )
}

export default SizePicker;