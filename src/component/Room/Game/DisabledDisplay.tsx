import React from "react";
import WordChooser from "./WordChooser";
import {IPlayer, RoomState} from "../../../types/GameModel";

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
    }

    return (
        <>

        </>
    )
}

export default DisabledDisplay;