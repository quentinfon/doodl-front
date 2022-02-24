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

    const modal_data = () => {
        let acc = []
        for (let i = 0; i < players?.length ?? 0; i++) {
            acc.push(
                <p key={"score-" + i} style={{color: players[i].roundPoint > 0 ? "green" : "red", fontStyle: "bold"}}>
                    {
                        players[i].name.toString() + " + " + Math.round(players[i].roundPoint) + " point" + (players[i].roundPoint > 1 && "s")
                    }
                </p>
            )
        }
        return acc
    }

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


            <Row
                justify={"center"}
                gutter={[10, 10]}
            >
                {modal_data().map((word: JSX.Element) => {

                    return (
                        <Col xs={24}>
                            <Card size={"small"} style={{textAlign: 'center'}}>
                                {word}
                            </Card>
                        </Col>
                    )
                })}
            </Row>

        </>
    )
}

export default EndRoundScoreDisplayer;