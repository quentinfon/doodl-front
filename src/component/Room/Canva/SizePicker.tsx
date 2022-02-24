import React from "react";
import {Col, Row} from "antd";


interface SizePickerProps {
    currentSize: number,
    setSize: (size: number) => any,
    vertical?: boolean
}

const SizePicker = ({
                        currentSize,
                        setSize
                    }: SizePickerProps) => {
    const tools: number[] = [5, 10, 25, 50]

    return (
        <>
            <Row
                justify="center"
                align="middle"
                gutter={[10, 10]}
            >
                {tools.map((size: number, index: number) => (
                    <Col xs={6}
                         style={{textAlign: "center"}}
                         key={index}
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