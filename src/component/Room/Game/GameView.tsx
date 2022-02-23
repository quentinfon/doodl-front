import React, {MutableRefObject, RefObject, useEffect, useRef, useState} from "react";
import {Col, Row} from "antd";
import DrawingToolTips from "../Canva/DrawingToolTips";
import {DrawTool, IDraw, IMessage, IPlayer, RoomState} from "../../../types/GameModel";
import WordDisplayer from "./WordDisplayer";
import DrawingCanva, {canvasFunctions} from "../Canva/DrawingCanva";
import GameChat from "../../GameChat";
import GamePlayerList from "./GamePlayerList";
import RoundDisplay from "./RoundDisplay";
import {
    GameSocketChannel,
    IDataChooseWordResponse,
    IDataGuessResponse,
    IDataInfoResponse,
    ISocketMessageRequest,
    ISocketMessageResponse
} from "../../../types/GameSocketModel";
import DisabledDisplay from "./DisabledDisplay";


interface GameViewProps {
    playerIsAllowedToDraw: MutableRefObject<boolean>,
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

    const gameDataRef = useRef<IDataInfoResponse>(gameData);

    const [guessedList, setGuessedList] = useState<IPlayer[]>([]);

    const sendMessage = (message: ISocketMessageRequest) => {
        socket?.send(JSON.stringify(message));
    }

    const getRemainingTime = (): number => {
        if (gameDataRef.current?.roundData?.dateStartedDrawing == null) return 0;
        return (new Date(gameDataRef.current.roundData.dateStartedDrawing).getTime() + gameDataRef.current.roomConfig.timeByTurn * 1000 - new Date().getTime()) / 1000;
    }

    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        gameDataRef.current = gameData;
        if (gameData.roundData?.dateStartedDrawing != null)
            setTimeLeft(getRemainingTime());
    }, [gameData]);


    useEffect(() => {
        console.log(timeLeft);
    }, [timeLeft]);


    const handleGuess = (event: any) => {
        const msg: ISocketMessageResponse = JSON.parse(event.data);
        if (msg.channel !== GameSocketChannel.GUESS) return;

        const data: IDataGuessResponse = msg.data as IDataGuessResponse;
        if (!data) return;

        setGuessedList(data.playersGuess);
    }

    const [chooseWordList, setChooseWordList] = useState<string[]>([]);

    const handleWordList = (event: any) => {
        const msg: ISocketMessageResponse = JSON.parse(event.data);
        if (msg.channel !== GameSocketChannel.CHOOSE_WORD) return;

        const data: IDataChooseWordResponse = msg.data as IDataChooseWordResponse;
        if (!data) return;

        console.log(data)

        setChooseWordList(data.words);
    }

    useEffect(() => {
        socket.addEventListener("message", handleGuess);
        socket.addEventListener("message", handleWordList);

        return (() => {
            socket.removeEventListener("message", handleGuess);
            socket.removeEventListener("message", handleWordList);
        })
    }, [socket]);

    return (
        <>
            <Row>
                <Col xs={24} md={6}>
                    <RoundDisplay
                        current={gameData.roundData?.roundCurrentCycle ?? 0}
                        total={gameData.roomConfig.cycleRoundByGame}
                    />

                    <GamePlayerList
                        adminPlayerId={gameData.playerAdminId ?? ""}
                        players={gameData.playerList}
                        drawingPlayers={gameData.roundData?.playerTurn ?? []}
                        currentPlayerId={player?.playerId ?? ""}
                        guessedList={guessedList}
                    />

                </Col>

                <Col xs={24} md={12}>

                    <WordDisplayer
                        wordToDisplay={gameData?.roundData?.word?.toUpperCase() ?? ""}
                        timeLeft={timeLeft}
                        totalTime={gameData.roomConfig.timeByTurn}
                        getRemainingTime={getRemainingTime}
                    />

                    <DrawingCanva
                        ref={canvasRef}
                        initDraw={initDraws}
                        webSocket={socket}
                        modeRef={modeRef}
                        player={player}
                        lineWidthRef={lineWidthRef}
                        colorRef={colorRef}
                        canDraw={playerIsAllowedToDraw}
                        disabled={gameData.roomState !== RoomState.DRAWING}
                        disabledDisplay={
                            <DisabledDisplay
                                wordList={chooseWordList}
                                onChooseWord={(word: string) => {

                                }}
                            />}
                    />

                    {playerIsAllowedToDraw.current &&
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