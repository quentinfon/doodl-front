import { Button, Card, Row, Col } from "antd";
import React, { useState } from "react";
import { Typography, Input, InputNumber, Select } from 'antd';
import { GameConfig, GameMode } from "../types/game";
import { UserOutlined, FieldTimeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const NewGame = () => {

    const [newGameConfig, setNewGameConfig] = useState<GameConfig>({
        gameMode: GameMode.CLASSIC,
        maxPlayer: 8,
        timeByTurn: 60
    })

    return (
        <>
            <Card>
                <Title level={3}>Create a game</Title>

                <Row>
                    <Col span={6}>
                        <Text>Max players</Text>
                        <Input.Group>
                            <InputNumber 
                                prefix={<UserOutlined style={{paddingRight: "5px"}} />}
                                min={2}
                                value={newGameConfig.maxPlayer} 
                                onChange={(e) => setNewGameConfig({...newGameConfig, maxPlayer: e}) } 
                            />
                        </Input.Group>
                    </Col>

                    <Col span={6} offset={1}>
                        <Text>Time by turn</Text>
                        <Input.Group>
                            <InputNumber 
                                min={5}
                                value={newGameConfig.timeByTurn} 
                                onChange={(e) => setNewGameConfig({...newGameConfig, timeByTurn: e}) } 
                                prefix={<FieldTimeOutlined style={{paddingRight: "5px"}} />}
                                addonAfter="seconds"
                            />
                        </Input.Group>
                    </Col>

                    <Col span={6} offset={1}>
                        <Text>Game mode</Text>
                        <Input.Group>
                            <Select 
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

                

                <Button
                    type="primary"
                >
                    Create
                </Button>
                          
            </Card>
        </>
    )
}

export default NewGame;