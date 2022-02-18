import React from "react";
import {IPlayer} from "../../../types/GameModel";
import {Avatar, Card, Divider, List, Typography} from "antd";

const {Title} = Typography;

interface LobbyPlayerListProps {
    adminPlayerId: string,
    players: IPlayer[]
}

const LobbyPlayerList = ({
                             adminPlayerId,
                             players
                         }: LobbyPlayerListProps) => {

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
                    renderItem={player => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={player.imgUrl}/>}
                                title={player.name}
                            />
                        </List.Item>
                    )}
                />
            </Card>

        </>
    )
}

export default LobbyPlayerList;