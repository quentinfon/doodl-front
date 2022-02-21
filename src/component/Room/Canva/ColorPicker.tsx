import React from "react";
import {Col, List, Row} from "antd";

interface ColorPickerProps {
    currentColor: string,
    setColor: (color: string) => any,
    vertical?: boolean
}

const ColorPicker = ({
                         currentColor,
                         setColor,
                         vertical = true
                     }: ColorPickerProps) => {

    const colors: string[] = [
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

            <Row
                gutter={[15,15]}
            >
                {colors.map((color: string) => {

                    return (
                        <Col xs={4} sm={3} lg={4} xl={3}
                             onClick={() => setColor(color)}
                        >
                            <svg viewBox="0 0 100 100"
                                 className={currentColor === color ? "selectedColor" : "selectableColor"}>
                                <rect x="0" y="0" width="100" height="100" rx="15" ry="15"
                                      fill={color}
                                />
                            </svg>
                        </Col>
                    )
                })}
            </Row>

        </>
    )
}

export default ColorPicker;