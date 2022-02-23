import React, {MutableRefObject, RefObject, useEffect, useRef, useState} from "react";
import {Col, Drawer, Modal, Row} from "antd";
import DrawingToolTips from "../Canva/DrawingToolTips";
import {DrawTool, IDraw, IMessage, IPlayer} from "../../../types/GameModel";
import WordDisplayer, {CountDownTime} from "./WordDisplayer";
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

    const [guessedList, setGuessedList] = useState<IPlayer[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(true);

    const sendMessage = (message: ISocketMessageRequest) => {
        socket?.send(JSON.stringify(message));
    }

    const modal_data = () => {
        let acc = []
        let players: IPlayer[]  =  gameData.playerList ?? [];
        for(let i=0; i < players?.length ?? 0; i++){
            acc.push(
                <p>
                    {players[i].name.toString() + " : " + players[i].roundPoint.toString() + " points"}
                </p>

            )
        }
        return acc
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    const getTime = (): number => {
        if (gameData?.roundData?.dateStartedDrawing == null) return 0;
        return (new Date(gameData.roundData.dateStartedDrawing).getTime() + gameData.roomConfig.timeByTurn * 1000 - new Date().getTime()) / 1000;
    }

    const [timeLeft, setTimeLeft] = useState<CountDownTime>({time: getTime(), key: 0});

    useEffect(() => {
        setTimeLeft({time: getTime(), key: timeLeft.key + 1});
    }, [gameData.roundData?.dateStartedDrawing]);

    useEffect(() => {

    }, [gameData.roomState]);

    useEffect(() => {
        console.log(timeLeft);
    }, [timeLeft]);


    const handlePickWord = (event: any) => {
        const msg: ISocketMessageResponse = JSON.parse(event.data);
        if (msg.channel !== GameSocketChannel.GUESS) return;

        const data: IDataGuessResponse = msg.data as IDataGuessResponse;
        if (!data) return;

        setGuessedList(data.playersGuess);
    }

    useEffect(() => {
        socket.addEventListener("message", handlePickWord);

        return (() => {
            socket.removeEventListener("message", handlePickWord);
        })
    }, [socket])

    return (
        <>

            <Modal title={null} visible={isModalVisible} footer={null} closable={false}>
                {modal_data()}
            </Modal>

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
                        refreshTimer={() => {
                            setTimeLeft({time: getTime(), key: timeLeft.key + 1});
                        }}
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