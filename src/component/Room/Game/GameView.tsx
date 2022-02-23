import React, {MutableRefObject, RefObject, useEffect, useRef, useState} from "react";
import {Col, Drawer, Row} from "antd";
import DrawingToolTips from "../Canva/DrawingToolTips";
import {DrawTool, IDraw, IMessage, IPlayer} from "../../../types/GameModel";
import WordDisplayer from "./WordDisplayer";
import DrawingCanva, {canvasFunctions} from "../Canva/DrawingCanva";
import GameChat from "../../GameChat";
import GamePlayerList from "./GamePlayerList";
import RoundDisplay from "./RoundDisplay";
import {
    GameSocketChannel,
    IDataGuessResponse,
    IDataInfoResponse,
    ISocketMessageRequest,
    ISocketMessageResponse
} from "../../../types/GameSocketModel";


interface GameViewProps {
    playerIsAllowedToDraw: boolean,
    canvasRef: RefObject<canvasFunctions> | undefined,
    sendDrawData: (drawData: IDraw) => any,
    mode: DrawTool,
    setMode: (tool: DrawTool) => any,
    color: string,
    setColor: (color: string) => any,
    lineWidth: number,
    setLineWidth: (width: number) => any,
    socket: WebSocket,
    modeRef: MutableRefObject<any>,
    lineWidthRef: MutableRefObject<any>,
    colorRef: MutableRefObject<any>,
    player: IPlayer | undefined,
    initDraws: IDraw[],
    messages: IMessage[],
    gameData: IDataInfoResponse
}

const GameView = ({
                      playerIsAllowedToDraw,
                      canvasRef,
                      sendDrawData,
                      mode,
                      setMode,
                      color,
                      setColor,
                      lineWidth,
                      setLineWidth,
                      socket,
                      modeRef,
                      lineWidthRef,
                      colorRef,
                      player,
                      initDraws,
                      messages,
                      gameData
                  }: GameViewProps) => {

    const guessedList = useRef<IPlayer[]>([]);

    const sendMessage = (message: ISocketMessageRequest) => {
        socket?.send(JSON.stringify(message));
    }

    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    const getTime = (): number => {
        if (gameData?.roundData?.dateStartedDrawing == null) return 0;

        return (new Date(gameData.roundData.dateStartedDrawing).getTime() + gameData.roomConfig.timeByTurn * 1000 - new Date().getTime()) / 1000;
    }

    useEffect(() => {
        console.debug(gameData.roundData)
        setTimeRemaining(getTime());
    }, [gameData.roundData]);

    useEffect(() => {
        console.log(timeRemaining);
    }, [timeRemaining]);


    const handlePickWord = (event: any) => {
        const msg: ISocketMessageResponse = JSON.parse(event.data);
        if (msg.channel !== GameSocketChannel.GUESS) return;

        const data: IDataGuessResponse = msg.data as IDataGuessResponse;
        if (!data) return;

        guessedList.current = data.playersGuess;
    }

    useEffect(() => {
        socket.addEventListener("message", handlePickWord);

        return (() => {
            socket.removeEventListener("message", handlePickWord);
        })
    }, [socket])

    return (
        <>
            <Row>
                <Col xs={24} md={6}>
                    <RoundDisplay
                        current={1}
                        total={gameData.roomConfig.cycleRoundByGame}
                    />

                    <GamePlayerList
                        adminPlayerId={gameData.playerAdminId ?? ""}
                        players={gameData.playerList}
                        drawingPlayers={gameData.roundData?.playerTurn ?? []}
                        currentPlayerId={player?.playerId ?? ""}
                        guessedList={guessedList.current ?? []}
                    />

                </Col>

                <Col xs={24} md={12}>

                    <WordDisplayer
                        wordToDisplay={gameData?.roundData?.word?.toUpperCase() ?? ""}
                        timeLeft={timeRemaining}
                    />

                    <DrawingCanva
                        ref={canvasRef}
                        initDraw={initDraws}
                        webSocket={socket}
                        player={player}
                        modeRef={modeRef}
                        lineWidthRef={lineWidthRef}
                        colorRef={colorRef}
                        canDraw={playerIsAllowedToDraw}
                    />

                    {playerIsAllowedToDraw &&
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
                    }
                </Col>

                <Col xs={24} md={6}>
                    <GameChat
                        messages={messages}
                        sendMessage={sendMessage}
                        player={player}
                    />
                </Col>
            </Row>
        </>
    )
}

export default GameView;