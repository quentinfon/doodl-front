import {Card, Col, Row, Typography} from "antd";
import React from "react";
import {CountdownCircleTimer} from "react-countdown-circle-timer";

const {Title} = Typography;

interface WordDisplayerProps {
    wordToDisplay: string,
    timeLeft: number,
    totalTime: number
}

const WordDisplayer = ({
                           wordToDisplay,
                           timeLeft,
                           totalTime
                       }: WordDisplayerProps) => {


    return (
        <Card
            style={{
                textAlign: "center"
            }}
            bodyStyle={{
                padding: "13px"
            }}
        >
            <Row
                justify={"space-between"}
                align={"middle"}
            >
                <Col
                    flex="auto"
                >
                    <Title
                        level={4}
                        style={{
                            margin: "0"
                        }}
                    >
                        {wordToDisplay.split('').map(letter => {

                            return (
                                <span
                                    style={{
                                        marginLeft: "5px",
                                        marginRight: "5px"
                                    }}
                                >
                            {letter}
                        </span>
                            )
                        })}
                    </Title>
                </Col>
                <Col>
                    <CountdownCircleTimer
                        isPlaying
                        initialRemainingTime={totalTime}
                        duration={timeLeft}
                        colors={['#1890ff', '#F7B801', '#A30000', '#A30000']}
                        colorsTime={[timeLeft / 2, timeLeft / 3, timeLeft / 4, 0]}
                        size={50}
                        strokeWidth={5}
                    >
                        {({remainingTime}) => remainingTime}
                    </CountdownCircleTimer>
                </Col>
            </Row>
        </Card>
    )
}

export default WordDisplayer;