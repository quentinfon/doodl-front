import {Col, Row} from "antd";
import React from "react";
import LobbyPlayerList from "./LobbyPlayerList";
import {IPlayer, IRoomConfig} from "../../../types/GameModel";
import LobbyConfig from "./LobbyConfig";
import {IDataInfoResponse} from "../../../types/GameSocketModel";

interface RoomLobbyProps {
    player: IPlayer | undefined,
    gameData: IDataInfoResponse,
    webSocket: WebSocket,
    setConfig: (config: IRoomConfig) => any
}

const RoomLobby = ({
                       player,
                       gameData,
                       webSocket,
                       setConfig
                   }: RoomLobbyProps) => {


    return (
        <>
            <Row>
                <Col
                    xs={24}
                    lg={12}
                    style={{
                        padding: "5%"
                    }}
                >
                    <LobbyConfig
                        gameData={gameData}
                        readOnly={player?.playerId !== gameData.playerAdminId}
                        webSocket={webSocket}
                        canLaunchGame={gameData.playerList.length >= 2}
                    />
                </Col>

                <Col
                    xs={24}
                    lg={12}
                    style={{
                        padding: "5%"
                    }}
                >
                    <LobbyPlayerList
                        adminPlayerId={gameData.playerAdminId ?? ""}
                        players={gameData.playerList}
                        currentPlayerId={player?.playerId ?? ""}
                    />
                </Col>
            </Row>

        </>
    )
}

export default RoomLobby;