import { Button, Card, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import { Typography, Input, InputNumber, Select } from 'antd';
import { IRoomConfig, GameMode, RoomConfig } from "../types/game";
import { UserOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { fetchUtil } from "../api/request";
import { getRoomCreationConfig, createNewRoom } from "../api/gameService";

const { Title, Text } = Typography;
const { Option } = Select;

const NewGame = () => {

    const [newGameConfig, setNewGameConfig] = useState<IRoomConfig>({
        gameMode: GameMode.CLASSIC,
        maxPlayer: 8,
        timeByTurn: 60
    })

    const [roomConfigParam, setRoomConfigParam] = useState<RoomConfig>();
    const [loadingParams, setLoadingParams] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const getRoomConfigParam = () => {
        fetchUtil( getRoomCreationConfig(),
            setRoomConfigParam,
            setLoadingParams,
            setError);
    }

    const [loadingNewRoom, setLoadingNewRoom] = useState<boolean>(false);
    const [errorNewRoom, setErrorNewRoom] = useState<string>("");

    const createRoom = () => {
        fetchUtil( createNewRoom(newGameConfig),
            (data) => console.log(data),
            setLoadingNewRoom,
            setErrorNewRoom
        )
    }

    useEffect(() => {
        getRoomConfigParam();
    }, []);

    return (
        <>
            <Card>
                <Title level={3}>Create a game</Title>

                <Row 
                    gutter={20}
                    style={{
                        marginBottom: 20
                    }}
                >
                    <Col sm={24} md={12} lg={6}>
                        <Text>Max players</Text>
                        <InputNumber 
                            style={{ width: "100%" }}
                            prefix={<UserOutlined style={{paddingRight: "5px"}} />}
                            min={roomConfigParam?.minMaxPlayer}
                            max={roomConfigParam?.maxMaxPlayer}
                            value={newGameConfig.maxPlayer} 
                            onChange={(e) => setNewGameConfig({...newGameConfig, maxPlayer: e}) } 
                        />
                    </Col>

                    <Col sm={24} md={12} lg={6}>
                        <Text>Time by turn</Text>
                        <InputNumber 
                            style={{ width: "100%" }}
                            min={roomConfigParam?.minTimeByTurn}
                            max={roomConfigParam?.maxTimeByTurn}
                            value={newGameConfig.timeByTurn} 
                            onChange={(e) => setNewGameConfig({...newGameConfig, timeByTurn: e}) } 
                            prefix={<FieldTimeOutlined style={{paddingRight: "5px"}} />}
                            addonAfter="seconds"
                        />
                    </Col>

                    <Col sm={24} md={12} lg={6}>
                        <Text>Game mode</Text>
                        <Input.Group>
                            <Select 
                                style={{ width: "100%" }}
                                value={newGameConfig.gameMode}
                                onChange={(e) => setNewGameConfig({...newGameConfig, gameMode: e})}
                            >
                                {Object.keys(GameMode).map((mode: string) => {
                                    return(
                                        <Option value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()}</Option>
                                    )
                                })}
                            </Select>
                        </Input.Group>
                    </Col>

                </Row>

                
                <Row justify="end">
                    <Button
                        type="primary"
                        disabled={loadingNewRoom}
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