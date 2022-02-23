import {Card, Col, Row, Typography} from "antd";
import React, {useEffect} from "react";
import {CountdownCircleTimer} from "react-countdown-circle-timer";

const {Title} = Typography;

interface WordDisplayerProps {
    wordToDisplay: string,
    timeLeft: CountDownTime,
    totalTime: number,
    refreshTimer: () => any
}

export interface CountDownTime {
    time: number,
    key: number
}

const WordDisplayer = ({
                           wordToDisplay,
                           timeLeft,
                           totalTime,
                           refreshTimer
                       }: WordDisplayerProps) => {

    /* On Timer Mounted */
    useEffect(() => {
        refreshTimer();
    }, [])

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
                        key={timeLeft.key}
                        initialRemainingTime={totalTime}
                        duration={timeLeft.time}
                        colors={['#1890ff', '#F7B801', '#A30000', '#A30000']}
                        colorsTime={[totalTime / 2, totalTime / 3, totalTime / 4, 0]}
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