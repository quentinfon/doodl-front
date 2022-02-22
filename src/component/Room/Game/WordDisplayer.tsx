import {Card, Typography} from "antd";
import React from "react";

const {Title} = Typography;

interface WordDisplayerProps {
    wordToDisplay: string
}

const WordDisplayer = ({
                           wordToDisplay
                       }: WordDisplayerProps) => {


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
        </Card>
    )
}

export default WordDisplayer;