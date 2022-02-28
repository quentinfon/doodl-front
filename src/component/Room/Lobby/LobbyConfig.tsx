import React, {useEffect, useState} from "react";
import {Button, Card, Col, Divider, Input, InputNumber, Row, Select, Tooltip, Typography} from "antd";
import {IRoomConfig} from "../../../types/GameModel";
import {fetchUtil} from "../../../api/request";
import {getRoomCreationConfig} from "../../../api/gameService";
import {FieldTimeOutlined, RedoOutlined} from '@ant-design/icons';
import {
    GameSocketChannel,
    IDataInfoResponse,
    ISocketMessageRequest,
    ISocketMessageResponse
} from "../../../types/GameSocketModel";
import {IConfigResponse} from "../../../types/ConfigModel";


const {Text, Title} = Typography;
const {Option} = Select;


interface LobbyConfigProps {
    gameData: IDataInfoResponse,
    readOnly: boolean,
    webSocket: WebSocket,
    canLaunchGame: boolean
}

const LobbyConfig = ({
                         gameData,
                         readOnly,
                         webSocket,
                         canLaunchGame
                     }: LobbyConfigProps) => {

    const [gameConfig, setGameConfig] = useState<IRoomConfig>(gameData.roomConfig);

    const [loadingParams, setLoadingParams] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [loadingStart, setLoadingStart] = useState<boolean>(false);

    const getRoomConfigParam = () => {
        fetchUtil(getRoomCreationConfig(),
            setRoomConfigParam,
            setLoadingParams,
            setError);
    }

    const onConfigChange = (event: any) => {
        const msg: ISocketMessageResponse = JSON.parse(event.data);
        if (msg.channel !== GameSocketChannel.CONFIG) return;

        const data: IRoomConfig = msg.data as IRoomConfig;
        if (!data) return;

        setGameConfig(data);
    }

    const sendConfig = (config: IRoomConfig) => {
        setLoadingStart(true);
        webSocket?.send(JSON.stringify({
            channel: GameSocketChannel.CONFIG,
            data: config
        } as ISocketMessageRequest))
        setTimeout(() => setLoadingStart(false), 1000);
    }


    useEffect(() => {
        webSocket.addEventListener("message", onConfigChange);

        return (() => {
            webSocket.removeEventListener("message", onConfigChange);
        })
    }, [webSocket])

    const startGame = () => {
        webSocket?.send(JSON.stringify({
            channel: GameSocketChannel.START
        } as ISocketMessageRequest))
    }

    const setNewConfig = (config: IRoomConfig) => {
        setGameConfig(config);
        sendConfig(config);
    }

    useEffect(() => {
        getRoomConfigParam();
    }, []);

    useEffect(() => {
        setGameConfig(gameData.roomConfig);
    }, [gameData.roomConfig])

    const [roomConfigParam, setRoomConfigParam] = useState<IConfigResponse>({
        gameMode: [],
        roomServerConfig: {
            minPlayerPerRoom: 2,
            maxPlayerPerRoom: 32,
            minPlayerNameLength: 3,
            maxPlayerNameLength: 16,
            minTimeByTurn: 15,
            maxTimeByTurn: 300,
            minCycleRoundByGame: 2,
            maxCycleRoundByGame: 20,
            maxChatMessageLength: 240,
            minPointGuess: 0,
            maxPointGuess: 2000
        },
        wordList: []
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
                            min={roomConfigParam.roomServerConfig.minCycleRoundByGame}
                            max={roomConfigParam.roomServerConfig.maxCycleRoundByGame}
                            value={gameConfig.cycleRoundByGame}
                            onChange={(e) => setNewConfig({...gameConfig, cycleRoundByGame: e})}
                            disabled={readOnly}
                        />
                    </Col>

                    <Col sm={24} lg={12}>
                        <Text>Time by turn</Text>
                        <InputNumber
                            style={{width: "100%"}}
                            min={roomConfigParam.roomServerConfig.minTimeByTurn}
                            max={roomConfigParam.roomServerConfig.maxTimeByTurn}
                            value={gameConfig.timeByTurn}
                            onChange={(e) => setNewConfig({...gameConfig, timeByTurn: e})}
                            prefix={<FieldTimeOutlined style={{paddingRight: "5px"}}/>}
                            addonAfter="seconds"
                            disabled={readOnly}
                        />
                    </Col>

                    <Col sm={24} lg={12}>
                        <Text>Game mode</Text>
                        <Input.Group>
                            <Select
                                style={{width: "100%"}}
                                value={gameConfig.gameMode}
                                onChange={(e) => setNewConfig({...gameConfig, gameMode: e})}
                                disabled={readOnly}
                            >
                                {roomConfigParam.gameMode.map((mode: string, idx: number) => {
                                    return (
                                        <Option key={idx}
                                                value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()}</Option>
                                    )
                                })}
                            </Select>
                        </Input.Group>
                    </Col>

                    <Col sm={24} lg={12}>
                        <Text>Word list</Text>
                        <Input.Group>
                            <Select
                                style={{width: "100%"}}
                                value={gameConfig.wordList}
                                onChange={(e) => setNewConfig({...gameConfig, wordList: e})}
                                disabled={readOnly}
                            >
                                {roomConfigParam.wordList.map((mode: string, idx: number) => {
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
                        <Tooltip title={!canLaunchGame ? "You need to at least be 2 to start a game." : ""}>
                            <Button
                                onClick={startGame}
                                type="primary"
                                disabled={!canLaunchGame || loadingStart}
                                loading={loadingStart}
                            >
                                Start
                            </Button>
                        </Tooltip>
                    </Row>
                }

            </Card>
        </>
    )

}

export default LobbyConfig;