import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from 'antd';
import { GameMessage, SocketMessage } from "../types/message";
import GameChat from "../component/GameChat";
import { RoomData } from "../types/game";
import { fetchUtil } from "../api/request";
import { getRoomData } from "../api/gameService";
import RoomUnvailable from "../component/Room/RoomUnvailabale";

const GamePage = () => {

    const { gameId } = useParams<{gameId: string}>();

    const navigate = useNavigate();

    const [ws, setWs] = useState<WebSocket>();

    const [roomData, setRoomData] = useState<RoomData>();
    const [loadingRoom, setLoadingRoom] = useState<boolean>(false);

    const getRoom = () => {
        setLoadingRoom(true);
        getRoomData(gameId ?? "")
            .then(async res => setRoomData(await res.json()))
            .catch(e => {})
            .finally(() => setLoadingRoom(false));
    }

    useEffect(() => {
        getRoom();

        return () => {
            ws?.close();
        }
    }, [])

    const createSocket = () => {

        let webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_ENDPOINT as string);
        webSocket.onopen = () => console.log('ws opened');
        webSocket.onclose = () => console.log('ws closed');
    
        webSocket.onmessage = e => {
            if (webSocket) return;
            const message = JSON.parse(e.data);
            console.log('e', message);
        };
    
        setWs(webSocket);
    }

    const sendMessage = (message: SocketMessage) => {
        ws?.send(JSON.stringify(message));
    }

    return (
        <>
            { loadingRoom ?
                <>

                </>
                :
                <>
                    {!roomData ? 
                        <RoomUnvailable />
                        :
                        <>
                            <Row>
                                <Col span={18}>


                                </Col>

                                <Col span={6}>
                                    <GameChat 
                                        messages={[]}
                                        sendMessage={sendMessage}
                                    />
                                </Col>
                            </Row>
                        </>
                    }
                </>
            }
        
        </>
    )
}

export default GamePage;