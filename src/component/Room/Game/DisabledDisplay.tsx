import React from "react";
import WordChooser from "./WordChooser";
import {IPlayer, RoomState} from "../../../types/GameModel";
import {Row, Typography} from "antd";

const {Title} = Typography;

interface DisabledDisplayProps {
    wordList: string[],
    onChooseWord: (word: string) => any,
    playerId: string,
    drawingPlayers: IPlayer[],
    roomState: RoomState
}

const DisabledDisplay = ({
                             wordList,
                             onChooseWord,
                             playerId,
                             drawingPlayers,
                             roomState
                         }: DisabledDisplayProps) => {

    const isDrawing = drawingPlayers.map(p => p.playerId).includes(playerId);

    if (isDrawing && roomState === RoomState.CHOOSE_WORD) {
        return (
            <WordChooser
                words={wordList}
                chooseWord={onChooseWord}
            />
        )
    } else if (!isDrawing && roomState === RoomState.CHOOSE_WORD) {
        return (
            <Row justify="center">
                <Title
                    level={3}
                    style={{
                        color: "#fff"
                    }}
                >
                    {drawingPlayers.map(p => p.name).join(', ')} {drawingPlayers.length > 1 ? "are" : "is"} choosing a
                    word...
                </Title>
            </Row>
        )
    }

    return (
        <>

        </>
    )
}

export default DisabledDisplay;