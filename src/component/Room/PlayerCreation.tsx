import React, {useState} from "react";
import {Button, Card, Col, Input, Row, Typography} from "antd";
import {IPlayer} from "../../types/GameModel";
import AvatarPicker from "./AvatarPicker";

const {Title, Text} = Typography;

interface PlayerCreationProps {
    createPlayer: (player: IPlayer) => any,
    loadingConnexion: boolean
}

const PlayerCreation = ({
                            createPlayer,
                            loadingConnexion
                        }: PlayerCreationProps) => {

    const [player, setPlayer] = useState<IPlayer>({
        playerId: "",
        name: `Player${Math.random().toString().substring(2, 6)}`,
        imgUrl: "",
        point: 0
    })

    return (
        <>

            <Row
                justify="center"
                style={{marginTop: "5%"}}
            >
                <Col lg={22}>

                    <Card>

                        <Title level={3}>Joining game</Title>

                        <Row>

                            <Col sm={24} md={12} lg={6}>
                                <Text>Nickname</Text>
                                <Input.Group>
                                    <Input
                                        value={player.name}
                                        onChange={(e) => setPlayer({...player, name: e.target.value})}
                                    />
                                </Input.Group>
                            </Col>

                            <Col sm={24} md={12} lg={6}>
                                <AvatarPicker
                                    setPlayerImg={(img: string) => setPlayer({...player, imgUrl: img})}
                                />
                            </Col>

                        </Row>

                        <Row
                            style={{
                                marginTop: "15px"
                            }}
                        >
                            <Button
                                onClick={() => createPlayer(player)}
                                disabled={loadingConnexion}
                                loading={loadingConnexion}
                            >
                                Join
                            </Button>
                        </Row>

                    </Card>

                </Col>
            </Row>


        </>
    )

}

export default PlayerCreation;