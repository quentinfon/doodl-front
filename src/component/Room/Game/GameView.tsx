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
    IDataGuessResponse,
    IDataInfoResponse,
    ISocketMessageRequest,
    ISocketMessageResponse
} from "../../../types/GameSocketModel";
import DisabledDisplay from "./DisabledDisplay";

import roundStartSound from '/sounds/roundStart.mp3';
import roundEndSound from '/sounds/roundEnd.mp3';
import wordGuessedSound from '/sounds/guessed.mp3';
import gameJoinSound from '/sounds/join.mp3';
import gameLeaveSound from '/sounds/leave.mp3';
import {getServerTime} from "../../../api/gameService";
import {fetchUtil} from "../../../api/request";

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
    gameData: IDataInfoResponse,
    chooseWordList: string[],
    setChooseWordList: (words: string[]) => any
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
                      gameData,
                      chooseWordList,
                      setChooseWordList
                  }: GameViewProps) => {

    const [guessedList, setGuessedList] = useState<IPlayer[]>([]);

    const [canvasHeight, setCanvasHeight] = useState<number>(0);

    const [actualRoomState, setActualRoomState] = useState<RoomState>(RoomState.LOBBY);
    const [actualPlayerNumber, setActualPlayerNumber] = useState<number>(gameData.playerList.length);
    const [actualPlayerGuess, setActualPlayerGuess] = useState<number>(0);
    const gameDataRef = useRef<IDataInfoResponse>(gameData);
    const roundStartAudio = new Audio(roundStartSound);
    const roundEndAudio = new Audio(roundEndSound);
    const wordGuessedAudio = new Audio(wordGuessedSound);
    const gameJoinAudio = new Audio(gameJoinSound);
    const gameLeaveAudio = new Audio(gameLeaveSound);

    const serverTimeDiff = useRef<number>(0);

    useEffect(() => {
        const requestDate: Date = new Date();
        fetchUtil(getServerTime(),
            (res: any) => {
                let servTime: Date = new Date(res.date);
                serverTimeDiff.current = (servTime.getTime() - (new Date().getTime() + requestDate.getTime()) / 2)
            },
            () => {
            },
            () => {
            });

    }, [])

    const sendMessage = (message: ISocketMessageRequest) => {
        socket?.send(JSON.stringify(message));
    }

    const getRemainingTime = (): number => {
        if (gameDataRef.current?.roundData?.dateStateStarted == null) return 0;
        return (new Date(gameDataRef.current.roundData.dateStateStarted).getTime() + serverTimeDiff.current + totalChronoTimeRef.current * 1000 - new Date().getTime()) / 1000;
    }

    const [timeLeft, setTimeLeft] = useState<number>(0);

    const [totalChronoTime, setTotalChronoTime] = useState<number>(gameData?.roomConfig.timeByTurn ?? 0);

    const totalChronoTimeRef = useRef(totalChronoTime);
    useEffect(() => {
        totalChronoTimeRef.current = totalChronoTime;
        setTimeLeft(getRemainingTime());
    }, [totalChronoTime])

    useEffect(() => {
        gameDataRef.current = gameData;

        if ([RoomState.CHOOSE_WORD, RoomState.END_GAME].includes(gameData?.roomState as RoomState)) {
            setGuessedList([]);
        }
        if (gameData.roomState === RoomState.DRAWING) {
            setChooseWordList([]);
            setTotalChronoTime(gameData.roomConfig.timeByTurn);
        }
        if (gameData.roomState === RoomState.CHOOSE_WORD && gameData.roundData) {
            setTotalChronoTime(gameData.roundData.delay.chooseWord)
        }
        if (gameData.roomState === RoomState.END_ROUND && gameData.roundData) {
            setTotalChronoTime(gameData.roundData.delay.endRound)
        }
        if (gameData.roomState === RoomState.END_GAME && gameData.roundData) {
            setTotalChronoTime(gameData.roundData.delay.endGame)
        }

        if (gameData.roundData?.dateStateStarted != null) {
            setTimeLeft(getRemainingTime());
        }
    }, [gameData]);


    const handleGuess = (event: any) => {
        const msg: ISocketMessageResponse = JSON.parse(event.data);
        if (msg.channel !== GameSocketChannel.GUESS) return;

        const data: IDataGuessResponse = msg.data as IDataGuessResponse;
        if (!data) return;

        setGuessedList(data.playersGuess);
    }

    useEffect(() => {
        socket.addEventListener("message", handleGuess);

        return (() => {
            socket.removeEventListener("message", handleGuess);
        })
    }, [socket]);

    useEffect(() => {
        if (gameData.roomState == RoomState.DRAWING && (actualRoomState == RoomState.LOBBY || actualRoomState == RoomState.END_ROUND)) {
            setActualRoomState(RoomState.DRAWING);
            setActualPlayerGuess(0);
            roundStartAudio.play();
        } else if (gameData.roomState == RoomState.END_ROUND && actualRoomState == RoomState.DRAWING) {
            setActualRoomState(RoomState.END_ROUND);
            roundEndAudio.play()
        }
        if (gameData.playerList.length < actualPlayerNumber) {
            setActualPlayerNumber(actualPlayerNumber - 1);
            gameLeaveAudio.play();
        }
        if (gameData.playerList.length > actualPlayerNumber) {
            setActualPlayerNumber(actualPlayerNumber + 1);
            gameJoinAudio.play();
        }
    }, [gameData])


    useEffect(() => {
        if (actualPlayerGuess < guessedList.length) {
            setActualPlayerGuess(actualPlayerGuess + 1);
            wordGuessedAudio.play();
        }
    }, [guessedList.length])


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
                        totalTime={totalChronoTime}
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
                        setCanvasHeight={setCanvasHeight}
                        disabledDisplay={
                            <DisabledDisplay
                                wordList={chooseWordList}
                                onChooseWord={(word: string) => {

                                    socket.send(JSON.stringify({
                                        channel: GameSocketChannel.CHOOSE_WORD,
                                        data: {word: word}
                                    } as ISocketMessageRequest))
                                }}
                                playerId={player?.playerId ?? ""}
                                roomState={gameData.roomState}
                                drawingPlayers={gameData.roundData?.playerTurn ?? []}
                                players={gameData.playerList}
                                word={gameData.roundData?.word ?? ""}
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
                        chatHeight={canvasHeight}
                    />
                </Col>
            </Row>
        </>
    )
}

export default GameView;