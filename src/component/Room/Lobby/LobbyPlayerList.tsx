import React from "react";
import {IPlayer} from "../../../types/GameModel";
import {Avatar, Badge, Card, Divider, List, Typography} from "antd";
import {UserOutlined} from '@ant-design/icons';

const {Title} = Typography;
const {Text} = Typography;

interface LobbyPlayerListProps {
    adminPlayerId: string,
    players: IPlayer[],
    currentPlayerId: string
}

const LobbyPlayerList = ({
                             adminPlayerId,
                             players,
                             currentPlayerId
                         }: LobbyPlayerListProps) => {

    const PlayerDisplay = ({
                               player
                           }: { player: IPlayer }) => {
        return (
            <>
                <Text
                    style={{color: player.playerId === currentPlayerId ? "#1890ff" : ""}}
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
                    renderItem={(player: IPlayer) => (
                        <>
                            {player.playerId === currentPlayerId ?
                                <Badge.Ribbon text="You" color="primary">
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src={player.imgUrl}/>}
                                            title={<PlayerDisplay player={player}/>}
                                        />
                                    </List.Item>
                                </Badge.Ribbon>
                                :
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={player.imgUrl}/>}
                                        title={<PlayerDisplay player={player}/>}
                                    />
                                </List.Item>
                            }
                        </>
                    )}
                />
            </Card>

        </>
    )
}

export default LobbyPlayerList;