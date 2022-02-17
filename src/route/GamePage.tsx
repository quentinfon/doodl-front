import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Col, Row} from 'antd';
import {IDataInitResponse, ISocketMessageRequest, ISocketMessageResponse, SocketChannel} from "../types/SocketModel";
import GameChat from "../component/GameChat";
import {IDraw, IMessage, IPlayer, IRoomStatus} from "../types/GameModel";
import {getRoomData} from "../api/gameService";
import RoomUnavailable from "../component/Room/RoomUnavailable";
import PlayerCreation from "../component/Room/PlayerCreation";
import DrawingCanva from "../component/Room/Canva/DrawingCanva";

const GamePage = () => {

    const {gameId} = useParams<{ gameId: string }>();

    const [ws, setWs] = useState<WebSocket>();
    const [player, setPlayer] = useState<IPlayer>();
    const [initDraws, setInitDraws] = useState<IDraw[]>([]);

    const [roomData, setRoomData] = useState<IRoomStatus>();
    const [loadingRoom, setLoadingRoom] = useState<boolean>(false);
    const [loadingConnexion, setLoadingConnexion] = useState<boolean>(false);

    const [pingInterval, setPingInterval] = useState<NodeJS.Timer>();

    const [messages, setMessages] = useState<IMessage[]>([]);

    const getRoom = () => {
        setLoadingRoom(true);
        getRoomData(gameId ?? "")
            .then(async res => {
                if (res.ok)
                    setRoomData(await res.json())
            })
            .catch(e => {
            })
            .finally(() => setLoadingRoom(false));
    }

    useEffect(() => {
        getRoom();

        return () => {
            ws?.close();
        }
    }, [ws])

    const sendMessage = (message: ISocketMessageRequest) => {
        ws?.send(JSON.stringify(message));
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

            setPingInterval(setInterval(() => {
                webSocket.send(JSON.stringify({channel: SocketChannel.PING}))
            }, 30 * 1000))

            setWs(webSocket);
            setLoadingConnexion(false);
        };

        webSocket.onclose = () => {
            console.debug("Socket closed");
            if (pingInterval) {
                clearInterval(pingInterval);
                setPingInterval(undefined);
            }
            console.log("success close")
            setWs(undefined);
        }

        webSocket.onmessage = e => {
            let msg: ISocketMessageResponse = JSON.parse(e.data);

            if (msg.channel === SocketChannel.INIT) {
                let init: IDataInitResponse = msg.data as IDataInitResponse;
                setPlayer({
                    playerId: init.playerId,
                    imgUrl: player.imgUrl,
                    name: player.name
                });
                messages.length = 0;
                init.messages.forEach(msg => messages.push(msg));
                setInitDraws(init.draws);
            }

            if (msg.channel === SocketChannel.CHAT) {
                messages.push(msg.data as IMessage)
                setMessages([...messages])
            }

            console.debug('e', JSON.parse(e.data));
        };
    }

    return (
        <>
            {loadingRoom ?
                <>

                </>
                :
                <>
                    {!roomData ?
                        <RoomUnavailable/>
                        :
                        <>
                            {ws === undefined ?

                                <>
                                    <PlayerCreation
                                        createPlayer={createSocket}
                                        loadingConnexion={loadingConnexion}
                                    />
                                </>

                                :
                                <Row>
                                    <Col xs={24} md={18}>
                                        <DrawingCanva
                                            initDraw={initDraws}
                                            webSocket={ws}
                                            player={player}
                                        />
                                    </Col>

                                    <Col xs={24} md={6}>
                                        <GameChat
                                            messages={messages}
                                            sendMessage={sendMessage}
                                            player={player}
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