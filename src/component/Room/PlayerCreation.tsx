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

    const pseudoLocalStorageKey = "pseudo";

    const [player, setPlayer] = useState<IPlayer>({
        playerId: "",
        name: getPlayerName(),
        imgUrl: "",
        point: 0
    })

    function getPlayerName(): string {
        const itemPseudo: any = localStorage.getItem(pseudoLocalStorageKey);
        if (itemPseudo) {
            return itemPseudo;
        }

        return `Player${Math.random().toString().substring(2, 6)}`;
    }

    function updatePlayerLocalStorage(newValue: string) {
        localStorage.setItem(pseudoLocalStorageKey, newValue);
    }

    return (
        <>

            <Row
                justify="center"
                style={{marginTop: "5%"}}
            >
                <Col xs={24} lg={22}>

                    <Card>

                        <Title level={3}>Joining game</Title>

                        <Row
                            gutter={[50, 25]}
                        >

                            <Col xs={24} md={12}>
                                <AvatarPicker
                                    setPlayerImg={(img: string) => setPlayer({...player, imgUrl: img})}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Title level={4}>Nickname</Title>
                                <Input.Group>
                                    <Input
                                        value={player.name}
                                        onChange={(e) => {
                                            setPlayer({...player, name: e.target.value});
                                            updatePlayerLocalStorage(e.target.value);
                                        }}
                                    />
                                </Input.Group>
                            </Col>

                        </Row>

                        <Row
                            justify="end"
                            style={{
                                marginTop: "25px"
                            }}
                        >
                            <Button
                                onClick={() => createPlayer(player)}
                                disabled={loadingConnexion}
                                loading={loadingConnexion}
                                type="primary"
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