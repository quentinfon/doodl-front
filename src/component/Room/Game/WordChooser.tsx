import React from "react";
import {Button, Col, Row, Typography} from "antd";

const {Title} = Typography;

interface WordChooserProps {
    words: string[],
    chooseWord: (word: string) => any
}

const WordChooser = ({
                         words,
                         chooseWord
                     }: WordChooserProps) => {

    return (
        <>
            <Row justify="center">
                <Title
                    level={3}
                    style={{
                        color: "#fff"
                    }}
                >
                    Choose a word
                </Title>
            </Row>


            <Row
                justify={"center"}
                gutter={[10, 10]}
            >
                {words.map((word: string) => {

                    return (
                        <Col xs={24}>
                            <Button
                                type="dashed"
                                onClick={() => chooseWord(word)}
                                style={{
                                    width: "100%"
                                }}
                            >
                                {word}
                            </Button>
                        </Col>
                    )
                })}
            </Row>

        </>
    )
}

export default WordChooser;