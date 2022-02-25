import {Col, Row} from "antd";
import React from "react";
import LobbyPlayerList from "./LobbyPlayerList";
import {IPlayer, IRoomConfig} from "../../../types/GameModel";
import LobbyConfig from "./LobbyConfig";
import {IDataInfoResponse} from "../../../types/GameSocketModel";
import LobbyInfo from "./LobbyInfo";

interface RoomLobbyProps {
    player: IPlayer | undefined,
    gameData: IDataInfoResponse,
    webSocket: WebSocket,
    setConfig: (config: IRoomConfig) => any,
    roomId: string
}

const RoomLobby = ({
                       player,
                       gameData,
                       webSocket,
                       setConfig,
                       roomId
                   }: RoomLobbyProps) => {


    return (
        <>

            <LobbyInfo
                roomId={roomId}
            />

            <Row
                style={{
                    marginLeft: "2.5%",
                    marginRight: "2.5%",
                }}
                gutter={[30, 30]}
            >

                <Col
                    xs={24}
                    lg={12}
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