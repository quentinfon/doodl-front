import React from "react";
import {Button, Col, Row, Typography} from "antd";

const {Title} = Typography;

interface WordChooserProps {
    words: string[],
    chooseWord: (word: string) => any,
    disabled: boolean
}

const WordChooser = ({
                         words,
                         chooseWord,
                         disabled
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
                                disabled={disabled}
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