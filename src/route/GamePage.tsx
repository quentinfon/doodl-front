import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {Grid} from 'antd';
import {
    GameSocketChannel,
    IDataInfoResponse,
    IDataInitResponse,
    ISocketMessageRequest,
    ISocketMessageResponse
} from "../types/SocketModel";
import {DrawTool, IDraw, IMessage, IPlayer, IRoomStatus, RoomState} from "../types/GameModel";
import {getRoomData} from "../api/gameService";
import RoomUnavailable from "../component/Room/RoomUnavailable";
import PlayerCreation from "../component/Room/PlayerCreation";
import {canvasFunctions} from "../component/Room/Canva/DrawingCanva";
import GameView from "../component/Room/Game/GameView";
import RoomLobby from "../component/Room/Lobby/RoomLobby";
import ErrorPage from "../component/Global/ErrorPage";
import errorPage from "../component/Global/ErrorPage";

const {useBreakpoint} = Grid;

const GamePage = () => {

    const {gameId} = useParams<{ gameId: string }>();

    const canvasRef = useRef<canvasFunctions>(null);

    const screens = useBreakpoint();

    const [ws, setWs] = useState<WebSocket>();
    const socketRef = useRef<WebSocket>();

    const [gameData, setGameData] = useState<IDataInfoResponse>();

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

    const [errorSocket, setErrorSocket] = useState<any>();

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
            channel: GameSocketChannel.DRAW,
            data: drawData
        }

        ws?.send(JSON.stringify(message));
    }

    const createSocket = (player: IPlayer) => {
        let webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_ENDPOINT as string);

        setLoadingConnexion(true);

        webSocket.onopen = () => {
            socketRef.current = webSocket;

            webSocket?.send(JSON.stringify({
                channel: GameSocketChannel.INIT,
                data: {
                    roomId: gameId,
                    name: player.name,
                    imgUrl: player.imgUrl
                }
            }));

            setPingInterval(setInterval(() => {
                socketRef?.current?.send(JSON.stringify({channel: GameSocketChannel.PING}))
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
            setWs(undefined);
            socketRef.current = undefined;
            console.log("success close");
        }

        webSocket.onerror = e => {
            console.error(e);
        }

        webSocket.onmessage = e => {
            let msg: ISocketMessageResponse = JSON.parse(e.data);

            if (msg.error) {
                console.debug(msg);
                setErrorSocket(msg.error);
            }

            if (msg.channel === GameSocketChannel.INIT) {
                let init: IDataInitResponse = msg.data as IDataInitResponse;
                setPlayer({
                    playerId: init.playerId,
                    imgUrl: player.imgUrl,
                    name: player.name,
                    point: 0
                });
                messages.length = 0;
                init.messages.forEach(msg => messages.push(msg));
                setInitDraws(init.draws);
            }

            if (msg.channel === GameSocketChannel.INFO) {
                setGameData(msg.data as IDataInfoResponse);
            }

            if (msg.channel === GameSocketChannel.CHAT) {
                messages.push(msg.data as IMessage)
                setMessages([...messages])
            }
        };
    }

    return (
        <>
            {errorSocket ? <ErrorPage errorMsg={errorPage}/>
                :
                <>
                    {loadingRoom ? <></>
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

                                        <>
                                            {gameData !== undefined ?
                                                <>
                                                    {gameData.roomState === RoomState.INGAME &&
                                                        <GameView
                                                            playerIsAllowedToDraw={playerIsAllowedToDraw}
                                                            canvasRef={canvasRef}
                                                            sendDrawData={sendDrawData}
                                                            mode={mode}
                                                            setMode={(tool: DrawTool) => {
                                                                setMode(tool);
                                                                modeRef.current = tool;
                                                            }}
                                                            color={color}
                                                            setColor={(color: string) => {
                                                                setColor(color);
                                                                colorRef.current = color;
                                                            }}
                                                            lineWidth={lineWidth}
                                                            setLineWidth={(width: number) => {
                                                                setLineWidth(width);
                                                                lineWidthRef.current = width;
                                                            }}
                                                            socket={ws}
                                                            modeRef={modeRef}
                                                            lineWidthRef={lineWidthRef}
                                                            colorRef={colorRef}
                                                            player={player}
                                                            initDraws={initDraws}
                                                            messages={messages}
                                                        />
                                                    }

                                                    {gameData.roomState === RoomState.LOBBY &&
                                                        <RoomLobby
                                                            player={player}
                                                            gameData={gameData}
                                                            webSocket={ws}
                                                            setConfig={(config) => {
                                                                setGameData({
                                                                    ...gameData,
                                                                    playerList: [...gameData?.playerList],
                                                                    playerTurn: [...gameData?.playerTurn],
                                                                    roomConfig: config
                                                                });
                                                            }}
                                                        />
                                                    }

                                                </>

                                                :
                                                <>

                                                </>
                                            }
                                        </>

                                    }
                                </>
                            }
                        </>
                    }
                </>
            }
        </>
    )
}

export default GamePage;