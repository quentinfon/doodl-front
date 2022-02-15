import React, { useState } from "react";
import { Card, Typography, Row, Col, Input, Button, Divider, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getRoomData } from "../api/gameService";

const { Title, Text } = Typography;

const JoinGame = () => {

    const navigate = useNavigate();

    const [roomId, setRoomId] = useState<string>("");
    const [loadingJoin, setLoadingJoin] = useState<boolean>(false);

    const goToRoom = () => {
        setLoadingJoin(true);
        getRoomData(roomId)
            .then(async res => {
                if (!res.ok) {
                    throw new Error("This room doesn't exist.");
                } else {
                    return await res.json();
                }
            }).then(data => navigate(`/play/${data.roomId}`))
            .catch(e => message.error(e.message))
            .finally(() => setLoadingJoin(false));
    }

    return (
        <>
            <Card
                style={{ height: "100%" }}
            >

                <Title level={3}>Join a game with a code</Title>

                <Divider />

                <Row
                    gutter={20}
                    style={{
                        marginBottom: 20
                    }}
                    align="bottom"
                >
                    <Col sm={24} md={12}>
                        <Text>Room id</Text>
                        <Input.Group
                            style={{ width: "100%" }}
                        >
                            <Input
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                onPressEnter={goToRoom}
                            />
                        </Input.Group>
                    </Col>

                    <Col>
                        <Button
                            type="primary"
                            onClick={goToRoom}
                            loading={loadingJoin}
                            disabled={loadingJoin}
                        >
                            Join
                        </Button>
                    </Col>

                </Row>

            </Card>
        </>
    )
}

export default JoinGame;