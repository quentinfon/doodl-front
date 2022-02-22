import { Card } from "antd";
import React, { useState } from "react";

interface WordDisplayerProps {
    wordToDisplay: string
}

const WordDisplayer = ({
    wordToDisplay
}: WordDisplayerProps) => {


    return (
        <Card>

            {wordToDisplay}

        </Card>
    )
}

export default WordDisplayer;