import {Card, Col, Row, Typography} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {CountdownCircleTimer} from "react-countdown-circle-timer";

const {Title} = Typography;

interface WordDisplayerProps {
    wordToDisplay: string,
    timeLeft: number,
    totalTime: number,
    getRemainingTime: () => number
}


const WordDisplayer = ({
                           wordToDisplay,
                           timeLeft,
                           totalTime,
                           getRemainingTime
                       }: WordDisplayerProps) => {

    const [timerKey, setTimerKey] = useState<number>(0);
    const localTime = useRef<number>(timeLeft);

    const onVisibilityChange = (e: any) => {
        console.log(`Tab state : ${document.visibilityState}`);
        if (document.visibilityState === "visible") {
            console.log("refresh")
            localTime.current = getRemainingTime();
            console.log(getRemainingTime());
            setTimerKey(timerKey + 1);
        }
    }

    useEffect(() => {
        document.addEventListener('visibilitychange', onVisibilityChange);

        return (() => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
        });
    }, []);


    useEffect(() => {
        localTime.current = timeLeft;
        setTimerKey(timerKey + 1);
    }, [timeLeft]);

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
                        key={timerKey}
                        initialRemainingTime={localTime.current}
                        duration={totalTime}
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