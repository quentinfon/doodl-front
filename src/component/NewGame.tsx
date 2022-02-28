import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Row, Typography} from "antd";
import {GameMode, IRoomConfig} from "../types/GameModel";
import {fetchUtil} from "../api/request";
import {createNewRoom} from "../api/gameService";
import {useNavigate} from 'react-router-dom';

const {Title} = Typography;

const NewGame = () => {

    const navigate = useNavigate();

    const [newGameConfig, setNewGameConfig] = useState<IRoomConfig>({
        gameMode: GameMode.CLASSIC,
        timeByTurn: 60,
        cycleRoundByGame: 3,
        wordList: "ANIMALS"
    })

    const [loadingNewRoom, setLoadingNewRoom] = useState<boolean>(false);
    const [errorNewRoom, setErrorNewRoom] = useState<string>("");

    const [roomCreatedId, setRoomCreatedId] = useState();

    useEffect(() => {
        if (roomCreatedId) navigate(`/play/${roomCreatedId}`);
    }, [roomCreatedId])

    const createRoom = () => {
        fetchUtil(createNewRoom(),
            (data) => setRoomCreatedId(data.roomId),
            setLoadingNewRoom,
            setErrorNewRoom
        )
    }


    return (
        <>
            <Card
                style={{height: "100%"}}
            >
                <Title level={3}>Create a game</Title>

                <Divider/>

                <Row justify="end">
                    <Button
                        disabled={loadingNewRoom}
                        loading={loadingNewRoom}
                        onClick={createRoom}
                    >
                        Create
                    </Button>
                </Row>

            </Card>
        </>
    )
}

export default NewGame;