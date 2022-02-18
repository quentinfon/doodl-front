import {Col, Row} from "antd";
import React, {useEffect} from "react";
import {
    GameSocketChannel,
    IDataInfoResponse,
    ISocketMessageRequest,
    ISocketMessageResponse
} from "../../../types/SocketModel";
import LobbyPlayerList from "./LobbyPlayerList";
import {IRoomConfig} from "../../../types/GameModel";
import LobbyConfig from "./LobbyConfig";

interface RoomLobbyProps {
    gameData: IDataInfoResponse,
    webSocket: WebSocket,
    setConfig: (config: IRoomConfig) => any
}

const RoomLobby = ({
                       gameData,
                       webSocket,
                       setConfig
                   }: RoomLobbyProps) => {


    const onConfigChange = (event: any) => {
        const msg: ISocketMessageResponse = JSON.parse(event.data);
        if (msg.channel !== GameSocketChannel.CONFIG) return;

        const data: IRoomConfig = msg.data as IRoomConfig;
        if (!data) return;

        setConfig(data);
    }


    useEffect(() => {
        webSocket.addEventListener("message", onConfigChange);

        return (() => {
            webSocket.removeEventListener("message", onConfigChange);
        })
    }, [webSocket])

    const startGame = () => {
        webSocket.send(JSON.stringify({
            channel: GameSocketChannel.START
        } as ISocketMessageRequest))
    }


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
                        readOnly={false}
                        setConfig={setConfig}
                        startGame={startGame}
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
                        adminPlayerId={""}
                        players={gameData.playerList}
                    />
                </Col>
            </Row>

        </>
    )
}

export default RoomLobby;