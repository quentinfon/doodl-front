import React, {useEffect, useState} from "react";
import {Button, Card, Col, Divider, Input, InputNumber, Row, Select, Typography} from "antd";
import {GameMode, IRoomConfig} from "../../../types/GameModel";
import {IRoomServerConfig} from "../../../types/ConfigModel";
import {IDataInfoResponse} from "../../../types/SocketModel";
import {fetchUtil} from "../../../api/request";
import {getRoomCreationConfig} from "../../../api/gameService";
import {FieldTimeOutlined, RedoOutlined} from '@ant-design/icons';


const {Text, Title} = Typography;
const {Option} = Select;


interface LobbyConfigProps {
    gameData: IDataInfoResponse,
    readOnly: boolean,
    setConfig: (config: IRoomConfig) => any,
    startGame: () => any,
    canLaunchGame: boolean
}

const LobbyConfig = ({
                         gameData,
                         readOnly,
                         setConfig,
                         startGame,
                         canLaunchGame
                     }: LobbyConfigProps) => {

    const [gameConfig, setGameConfig] = useState<IRoomConfig>(gameData.roomConfig);

    const [loadingParams, setLoadingParams] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const getRoomConfigParam = () => {
        fetchUtil(getRoomCreationConfig(),
            setRoomConfigParam,
            setLoadingParams,
            setError);
    }

    useEffect(() => {
        getRoomConfigParam();
    }, []);

    useEffect(() => {
        setGameConfig(gameData.roomConfig);
    }, [gameData.roomConfig])

    const [roomConfigParam, setRoomConfigParam] = useState<IRoomServerConfig>({
        minPlayerPerRoom: 2,
        maxPlayerPerRoom: 32,
        minTimeByTurn: 15,
        maxTimeByTurn: 300,
        minCycleRoundByGame: 2,
        maxCycleRoundByGame: 20,
        maxChatMessageLength: 240,
        minPointGuess: 0,
        maxPointGuess: 2000
    });

    return (
        <>
            <Card>
                <Title level={3}>
                    Game Settings
                </Title>

                <Divider/>

                <Row
                    gutter={[20, 20]}
                    style={{
                        marginBottom: 20
                    }}
                >

                    <Col sm={24} lg={12}>
                        <Text>Number of rounds</Text>
                        <InputNumber
                            style={{width: "100%"}}
                            prefix={<RedoOutlined style={{paddingRight: "5px"}}/>}
                            min={roomConfigParam.minCycleRoundByGame}
                            max={roomConfigParam.maxCycleRoundByGame}
                            value={gameConfig.cycleRoundByGame}
                            onChange={(e) => setConfig({...gameConfig, cycleRoundByGame: e})}
                        />
                    </Col>

                    <Col sm={24} lg={12}>
                        <Text>Time by turn</Text>
                        <InputNumber
                            style={{width: "100%"}}
                            min={roomConfigParam.minTimeByTurn}
                            max={roomConfigParam.maxTimeByTurn}
                            value={gameConfig.timeByTurn}
                            onChange={(e) => setConfig({...gameConfig, timeByTurn: e})}
                            prefix={<FieldTimeOutlined style={{paddingRight: "5px"}}/>}
                            addonAfter="seconds"
                        />
                    </Col>

                    <Col sm={24} lg={12}>
                        <Text>Game mode</Text>
                        <Input.Group>
                            <Select
                                style={{width: "100%"}}
                                value={gameConfig.gameMode}
                                onChange={(e) => setConfig({...gameConfig, gameMode: e})}
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

                {!readOnly &&
                    <Row justify="end">
                        <Button
                            onClick={startGame}
                            type="primary"
                            disabled={!canLaunchGame}
                        >
                            Start
                        </Button>
                    </Row>
                }

            </Card>
        </>
    )

}

export default LobbyConfig;