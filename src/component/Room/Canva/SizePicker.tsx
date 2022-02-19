import React from "react";
import {Col, List, Row} from "antd";


interface SizePickerProps {
    currentSize: number,
    setSize: (size: number) => any,
    vertical?: boolean
}

const SizePicker = ({
                        currentSize,
                        setSize,
                        vertical = true
                    }: SizePickerProps) => {
    const tools: number[] = [5, 10, 25, 50]

    return (
        <>
            <List
                grid={{
                    gutter: 16,
                    column: vertical ? 4 : 2,
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


                    </List.Item>
                )}
            />
            <Row
                justify="center"
                align="middle"
            >
                {tools.map(size => (
                    <Col xs={6} lg={12}
                         style={{alignItems: "center"}}
                    >
                        <svg viewBox="0 0 100 100"
                             onClick={() => setSize(size)}
                             width={50}
                             height={50}
                        >
                            <circle cx="50" cy="50" r={size} fill={currentSize === size ? "#000000" : "#D1D1D1"}/>
                        </svg>
                    </Col>
                ))}

            </Row>
        </>
    )
}

export default SizePicker;