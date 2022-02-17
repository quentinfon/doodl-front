import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {Col, Grid, Row} from 'antd';
import {IDataInitResponse, ISocketMessageRequest, ISocketMessageResponse, SocketChannel} from "../types/SocketModel";
import GameChat from "../component/GameChat";
import {DrawTool, IDraw, IMessage, IPlayer, IRoomStatus} from "../types/GameModel";
import {getRoomData} from "../api/gameService";
import RoomUnavailable from "../component/Room/RoomUnavailable";
import PlayerCreation from "../component/Room/PlayerCreation";
import DrawingCanva, {canvasFunctions} from "../component/Room/Canva/DrawingCanva";
import WordDisplayer from "../component/Room/WordDisplayer";
import DrawingToolTips from "../component/Room/Canva/DrawingToolTips";

const {useBreakpoint} = Grid;

const GamePage = () => {

    const {gameId} = useParams<{ gameId: string }>();

    const canvasRef = useRef<canvasFunctions>(null);

    const screens = useBreakpoint();

    const [ws, setWs] = useState<WebSocket>();
    const [player, setPlayer] = useState<IPlayer>();
    const [initDraws, setInitDraws] = useState<IDraw[]>([]);

    const [roomData, setRoomData] = useState<IRoomStatus>();
    const [loadingRoom, setLoadingRoom] = useState<boolean>(false);
    const [loadingConnexion, setLoadingConnexion] = useState<boolean>(false);

    const [mode, setMode] = useState<DrawTool>(DrawTool.BRUSH);
    const [lineWidth, setLineWidth] = useState<number>(10);
    const [color, setColor] = useState<string>("#000000");
    const modeRef = useRef(mode);
    const lineWidthRef = useRef(lineWidth);
    const colorRef = useRef(color);

    const [pingInterval, setPingInterval] = useState<NodeJS.Timer>();

    const [messages, setMessages] = useState<IMessage[]>([]);

    const [playerIsAllowedToDraw, setPlayerIsAllowedToDraw] = useState<boolean>(true);

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

    const sendDrawData = (drawData: IDraw) => {
        const message: ISocketMessageRequest = {
            channel: SocketChannel.DRAW,
            data: drawData
        }

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

            if(msg.channel === SocketChannel.INFO){
                console.log(msg);
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
                                    {playerIsAllowedToDraw &&
                                        <Col xs={24} md={6} xl={4}>
                                            <DrawingToolTips
                                                clearCanvas={() => {
                                                    sendDrawData({tool: DrawTool.CLEAR});
                                                    canvasRef?.current?.clear();
                                                }}
                                                tool={mode}
                                                setTool={(t: DrawTool) => {
                                                    modeRef.current = t;
                                                    setMode(t);
                                                }}
                                                color={color}
                                                setColor={(c: string) => {
                                                    colorRef.current = c;
                                                    setColor(c);
                                                }}
                                                lineWidth={lineWidth}
                                                setLineWidth={(s: number) => {
                                                    lineWidthRef.current = s;
                                                    setLineWidth(s);
                                                }}
                                            />
                                        </Col>
                                    }

                                    <Col xs={24} md={12} xl={14}>
                                        <WordDisplayer
                                            wordToDisplay={"Test ____"}
                                        />
                                        <DrawingCanva
                                            ref={canvasRef}
                                            initDraw={initDraws}
                                            webSocket={ws}
                                            player={player}
                                            modeRef={modeRef}
                                            lineWidthRef={lineWidthRef}
                                            colorRef={colorRef}
                                            canDraw={playerIsAllowedToDraw}
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