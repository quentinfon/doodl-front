import React from "react";
import {Card, Col, Row, Typography} from "antd";
import {IPlayer} from "../../../types/GameModel";

const {Title} = Typography;

interface ScoreProps {
    players: IPlayer[]
}

const EndRoundScoreDisplayer = ({
                                    players
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
                    Score Displayer
                </Title>
            </Row>


                {players.map((player: IPlayer, idx: number) => {

                    return (
                        <Row
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
                            <Col >
                                <Title level={4}  key={"score-" + idx} style={{color: player.roundPoint > 0 ? "green" : "red"}}>
                                    {
                                        Math.round(player.roundPoint) + " point" + (player.roundPoint > 1 && "s")
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