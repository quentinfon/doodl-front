import React from "react";
import {IPlayer} from "../../../types/GameModel";
import {Avatar, Card, List} from "antd";

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