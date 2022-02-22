import React from "react";
import {IPlayer} from "../../../types/GameModel";
import {Avatar, Badge, Card, Col, Divider, List, Row, Typography} from "antd";
import {UserOutlined} from '@ant-design/icons';

const {Title} = Typography;
const {Text} = Typography;

interface GamePlayerListProps {
    adminPlayerId: string,
    players: IPlayer[],
    drawingPlayers: IPlayer[],
    currentPlayerId: string
}

const GamePlayerList = ({
                            adminPlayerId,
                            players,
                            drawingPlayers,
                            currentPlayerId
                        }: GamePlayerListProps) => {


    const PlayerDisplay = ({
                               player
                           }: { player: IPlayer }) => {

        return (
            <>
                <Text
                    style={{color: player.playerId === currentPlayerId ? "#1890ff" : ""}}
                    strong
                >
                    {player.name}
                    {player.playerId === adminPlayerId &&
                        <UserOutlined
                            style={{
                                paddingLeft: "10px",
                                color: '#ff4d4f'
                            }}
                        />
                    }
                </Text>
            </>
        )
    }

    const PlayerCard = ({
                            player
                        }: { player: IPlayer }) => {

        const drawing: boolean = drawingPlayers.map(p => p.playerId).indexOf(player.playerId) !== -1;

        return (
            <Row
                gutter={[5, 5]}
                style={{
                    background: drawing ? "rgba(24,144,255,0.3)" : "",
                    padding: "5px"
                }}
            >
                <Col>
                    <Avatar size="large" src={player.imgUrl}/>
                </Col>

                <Col>
                    <PlayerDisplay player={player}/>
                    <br/>
                    <Text
                        type="secondary"
                    >
                        {player.point} points
                    </Text>
                </Col>

            </Row>
        )
    }

    return (
        <>
            <Card>
                <Title
                    level={3}
                >
                    Players
                </Title>

                <Divider/>

                <List
                    itemLayout="horizontal"
                    dataSource={players}
                    renderItem={(player: IPlayer) => {

                        return (
                            <>
                                {player.playerId === currentPlayerId ?
                                    <Badge.Ribbon text="You" color="primary">
                                        <PlayerCard player={player}/>
                                    </Badge.Ribbon>
                                    :
                                    <PlayerCard player={player}/>
                                }
                            </>
                        )
                    }}
                />
            </Card>

        </>
    )
}

export default GamePlayerList;