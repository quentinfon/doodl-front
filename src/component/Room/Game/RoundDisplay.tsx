import {Card, Typography} from "antd";
import React from "react";

const {Title} = Typography;

interface RoundDisplayProps {
    current: number,
    total: number
}

const RoundDisplay = ({
                          current,
                          total
                      }: RoundDisplayProps) => {

    return (
        <Card
            style={{
                textAlign: "center"
            }}
        >
            <Title
                level={4}
                style={{
                    margin: "0"
                }}
            >
                Round {current} of {total}
            </Title>
        </Card>
    )
}

export default RoundDisplay;