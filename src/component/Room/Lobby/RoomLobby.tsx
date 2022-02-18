import {Col, Row} from "antd";
import React from "react";
import {IDataInfoResponse} from "../../../types/SocketModel";
import LobbyPlayerList from "./LobbyPlayerList";

interface RoomLobbyProps {
    gameData: IDataInfoResponse
}

const RoomLobby = ({
                       gameData
                   }: RoomLobbyProps) => {

    return (
        <>
            <Row>
                <Col sm={24} lg={12}>

                </Col>

                <Col sm={24} lg={12}>
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