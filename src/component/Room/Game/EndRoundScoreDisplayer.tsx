import React from "react";
import {Col, Row, Typography} from "antd";
import {IPlayer} from "../../../types/GameModel";

const {Title} = Typography;

interface ScoreProps {
    players: IPlayer[],
    word: string
}

const EndRoundScoreDisplayer = ({
                                    players,
                                    word
                                }: ScoreProps) => {
    return (
        <>
            <Row justify="center">
                <Title
                    level={3}
                    style={{
                        color: "#fff"
                    }}
                >
                    {word.length > 0 ? "The word was " + word : "No word was selected"}
                </Title>
            </Row>

            {players.sort((p1: IPlayer, p2: IPlayer) => p2.roundPoint - p1.roundPoint).map((player: IPlayer, idx: number) => {
                return (
                    <Row
                        key={idx}
                        justify={"space-between"}
                        gutter={15}
                    >
                        <Col>
                            <Title level={4} key={"score-" + idx} style={{color: "#fff"}}>
                                {
                                    player.name.toString()
                                }
                            </Title>
                        </Col>
                        <Col>
                            <Title level={4} key={"score-" + idx}
                                   style={{color: player.roundPoint > 0 ? "green" : "red"}}>
                                {
                                    Math.round(player.roundPoint) + " point" + (player.roundPoint > 1 ? "s" : "")
                                }
                            </Title>
                        </Col>

                    </Row>
                )
            })}
        </>
    )
}

export default EndRoundScoreDisplayer;