import React, {MutableRefObject, RefObject} from "react";
import {Col, Row} from "antd";
import DrawingToolTips from "../Canva/DrawingToolTips";
import {DrawTool, IDraw, IMessage, IPlayer} from "../../../types/GameModel";
import WordDisplayer from "./WordDisplayer";
import DrawingCanva, {canvasFunctions} from "../Canva/DrawingCanva";
import GameChat from "../../GameChat";
import GamePlayerList from "./GamePlayerList";
import RoundDisplay from "./RoundDisplay";
import {IDataInfoResponse, ISocketMessageRequest} from "../../../types/GameSocketModel";


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

    const sendMessage = (message: ISocketMessageRequest) => {
        socket?.send(JSON.stringify(message));
    }

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
                    />

                </Col>

                <Col xs={24} md={12}>
                    <WordDisplayer
                        wordToDisplay={gameData?.roundData?.anonymeWord ?? ""}
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