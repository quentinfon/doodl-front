import React from "react";
import {Col, Row, Typography} from "antd";
import {IPlayer} from "../../../types/GameModel";
import {TrophyOutlined} from '@ant-design/icons';

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
                    The game is over!
                </Title>
            </Row>

            {players.sort((p1: IPlayer, p2: IPlayer) => p2.totalPoint - p1.totalPoint).map((player: IPlayer, idx: number) => {
                return (
                    <Row
                        justify={"space-between"}
                        gutter={15}
                    >
                        <Col>
                            <Title level={4} key={"totalScore-" + idx} style={{color: "#fff"}}>
                                {idx === 0 && <TrophyOutlined style={{color: "#ebc934", marginRight: "8px"}}/>}
                                {
                                    player.name.toString()
                                }
                            </Title>
                        </Col>
                        <Col>
                            <Title level={4} key={"totalScore-" + idx} style={{color: "#4c8df5"}}>
                                {
                                    Math.round(player.totalPoint) + " point" + (player.totalPoint > 1 ? "s" : "")
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