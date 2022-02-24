import React from "react";
import WordChooser from "./WordChooser";

interface DisabledDisplayProps {
    wordList: string[],
    onChooseWord: (word: string) => any
}

const DisabledDisplay = ({
                             wordList,
                             onChooseWord
                         }: DisabledDisplayProps) => {

    return (
        <>
            <WordChooser
                words={wordList}
                chooseWord={onChooseWord}
            />
        </>
    )
}

export default DisabledDisplay;