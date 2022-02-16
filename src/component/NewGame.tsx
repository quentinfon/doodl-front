import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Row, Select, Typography} from "antd";
import {GameMode, IRoomConfig} from "../types/GameModel";
import {fetchUtil} from "../api/request";
import {createNewRoom, getRoomCreationConfig} from "../api/gameService";
import {useNavigate} from 'react-router-dom';
import {IRoomServerConfig} from "../types/ConfigModel";

const {Title, Text} = Typography;
const {Option} = Select;

const NewGame = () => {

    const navigate = useNavigate();

    const [newGameConfig, setNewGameConfig] = useState<IRoomConfig>({
        gameMode: GameMode.CLASSIC,
        maxPlayer: 8,
        timeByTurn: 60
    })

    const [roomConfigParam, setRoomConfigParam] = useState<IRoomServerConfig>({
        minMaxPlayer: 2,
        maxMaxPlayer: 32,
        minTimeByTurn: 15,
        maxTimeByTurn: 300,
        maxChatMessageLength: 240
    });

    const [loadingParams, setLoadingParams] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const getRoomConfigParam = () => {
        fetchUtil(getRoomCreationConfig(),
            setRoomConfigParam,
            setLoadingParams,
            setError);
    }

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

    useEffect(() => {
        getRoomConfigParam();
    }, []);

    return (
        <>
            <Card
                style={{height: "100%"}}
            >
                <Title level={3}>Create a game</Title>

                <Divider/>

                {/*
                <Row
                    gutter={20}
                    style={{
                        marginBottom: 20
                    }}
                >
                    <Col sm={24} md={12} lg={8}>
                        <Text>Max players</Text>
                        <InputNumber
                            style={{width: "100%"}}
                            prefix={<UserOutlined style={{paddingRight: "5px"}}/>}
                            min={roomConfigParam.minMaxPlayer}
                            max={roomConfigParam.maxMaxPlayer}
                            value={newGameConfig.maxPlayer}
                            onChange={(e) => setNewGameConfig({...newGameConfig, maxPlayer: e})}
                        />
                    </Col>

                    <Col sm={24} md={12} lg={8}>
                        <Text>Time by turn</Text>
                        <InputNumber
                            style={{width: "100%"}}
                            min={roomConfigParam.minTimeByTurn}
                            max={roomConfigParam.maxTimeByTurn}
                            value={newGameConfig.timeByTurn}
                            onChange={(e) => setNewGameConfig({...newGameConfig, timeByTurn: e})}
                            prefix={<FieldTimeOutlined style={{paddingRight: "5px"}}/>}
                            addonAfter="seconds"
                        />
                    </Col>

                    <Col sm={24} md={12} lg={8}>
                        <Text>Game mode</Text>
                        <Input.Group>
                            <Select
                                style={{width: "100%"}}
                                value={newGameConfig.gameMode}
                                onChange={(e) => setNewGameConfig({...newGameConfig, gameMode: e})}
                            >
                                {Object.keys(GameMode).map((mode: string, idx: number) => {
                                    return (
                                        <Option key={idx}
                                                value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()}</Option>
                                    )
                                })}
                            </Select>
                        </Input.Group>
                    </Col>

                </Row>
                */}


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