import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {DrawTool, IDraw, IMessage, IPlayer, IRoomStatus, RoomState} from "../types/GameModel";
import {getRoomData} from "../api/gameService";
import RoomUnavailable from "../component/Room/RoomUnavailable";
import PlayerCreation from "../component/Room/PlayerCreation";
import {canvasFunctions} from "../component/Room/Canva/DrawingCanva";
import GameView from "../component/Room/Game/GameView";
import RoomLobby from "../component/Room/Lobby/RoomLobby";
import ErrorPage from "../component/Global/ErrorPage";
import errorPage from "../component/Global/ErrorPage";
import {
    GameSocketChannel,
    IDataChooseWordResponse,
    IDataInfoResponse,
    IDataInitResponse,
    ISocketMessageRequest,
    ISocketMessageResponse
} from "../types/GameSocketModel";


const GamePage = () => {

    const {gameId} = useParams<{ gameId: string }>();

    const canvasRef = useRef<canvasFunctions>(null);

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

    const [errorSocket, setErrorSocket] = useState<any>();
    const [chooseWordList, setChooseWordList] = useState<string[]>([]);

    const canDraw = useRef<boolean>(false);

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

    const sendDrawData = (drawData: IDraw) => {
        const message: ISocketMessageRequest = {
            channel: GameSocketChannel.DRAW,
            data: drawData
        }

        ws?.send(JSON.stringify(message));
    }

    const createSocket = (player: IPlayer) => {
        let webSocket = new WebSocket(import.meta.env.VITE_WEBSOCKET_ENDPOINT as string);

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
                if (msg.channel === GameSocketChannel.INIT)
                    setErrorSocket(msg.error);
            }

            if (msg.channel === GameSocketChannel.INIT) {
                let init: IDataInitResponse = msg.data as IDataInitResponse;
                setPlayer({
                    playerId: init.playerId,
                    imgUrl: player.imgUrl,
                    name: player.name,
                    totalPoint: 0,
                    roundPoint: 0
                });
                setMessages(init.messages ?? []);
                setInitDraws(init.draws);
            }

            if (msg.channel === GameSocketChannel.INFO) {
                setGameData(msg.data as IDataInfoResponse);
            }

            if (msg.channel === GameSocketChannel.CHAT) {
                let arr = messages;
                arr.push(msg.data as IMessage);
                setMessages([...arr]);
            }

            if (msg.channel === GameSocketChannel.CHOOSE_WORD) {
                setChooseWordList((msg.data as IDataChooseWordResponse).words);
            }
        };
    }

    useEffect(() => {
        if ([RoomState.CHOOSE_WORD, RoomState.END_GAME].includes(gameData?.roomState as RoomState)) {
            canvasRef?.current?.forceClear();
        }

        if (gameData?.roomState !== RoomState.DRAWING) {
            canDraw.current = false;
        } else {
            canDraw.current = gameData?.roundData?.playerTurn.map(p => p.playerId).indexOf(player?.playerId ?? "") !== -1;
        }
    }, [gameData])

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
                                                    {gameData.roomState !== RoomState.LOBBY &&
                                                        <>
                                                            <GameView
                                                                playerIsAllowedToDraw={canDraw}
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
                                                                gameData={gameData}
                                                                chooseWordList={chooseWordList}
                                                                setChooseWordList={setChooseWordList}
                                                            />
                                                        </>
                                                    }

                                                    {gameData.roomState === RoomState.LOBBY &&
                                                        <RoomLobby
                                                            player={player}
                                                            gameData={gameData}
                                                            webSocket={ws}
                                                            setConfig={(config) => {
                                                                setGameData({
                                                                    ...gameData,
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