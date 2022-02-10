import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from 'antd';
import { IDataChatResponse, IDraw, ISocketMessageRequest, ISocketMessageResponse, SocketChannel } from "../types/message";
import GameChat from "../component/GameChat";
import { IPlayer, RoomData } from "../types/game";
import { getRoomData } from "../api/gameService";
import RoomUnvailable from "../component/Room/RoomUnvailabale";
import PlayerCreation from "../component/Room/PlayerCreation";
import DrawingCanva from "../component/Room/Canva/DrawingCanva";

const GamePage = () => {

    const { gameId } = useParams<{gameId: string}>();

    const [ws, setWs] = useState<WebSocket>();

    const [roomData, setRoomData] = useState<RoomData>();
    const [loadingRoom, setLoadingRoom] = useState<boolean>(false);
    const [loadingConnexion, setLoadingConnexion] = useState<boolean>(false);

    const [messages, setMessages] = useState<IDataChatResponse[]>([]);

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

    const sendMessage = (message: ISocketMessageRequest) => {
        ws?.send(JSON.stringify(message));
    }

    const sendDraw = (draw: IDraw) => {
        ws?.send(JSON.stringify(draw));
    }

    const createSocket = (player: IPlayer) => {

        let webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_ENDPOINT as string);

        setLoadingConnexion(true);

        webSocket.onopen = () => {
            webSocket?.send(JSON.stringify({
                channel: SocketChannel.INIT,
                data: {
                    roomId: gameId,
                    name: player.name,
                    imgUrl: player.imgUrl
                }
            }));

            setWs(webSocket);
            setLoadingConnexion(false);
        };

        webSocket.onclose = () => console.log('ws closed');
    
        webSocket.onmessage = e => {
            let msg : ISocketMessageResponse = JSON.parse(e.data);

            if (msg.channel == SocketChannel.CHAT) {
                messages.push(msg.data as IDataChatResponse)
                setMessages([...messages])
            }
            const message = JSON.parse(e.data);
            console.log('e', message);
        };
    }

    useEffect(() => console.log(ws), [ws])

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
                            { ws === undefined ?

                                <>
                                    <PlayerCreation 
                                        createPlayer={createSocket}
                                        loadingConnexion={loadingConnexion}
                                    />
                                </>

                                :
                                <Row>
                                    <Col span={18}>
                                        <DrawingCanva />

                                    </Col>

                                    <Col span={6}>
                                        <GameChat 
                                            messages={messages}
                                            sendMessage={sendMessage}
                                        />
                                    </Col>
                                </Row>
                            }
                        </>
                    }
                </>
            }
        
        </>
    )
}

export default GamePage;