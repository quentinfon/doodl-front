import React, { useState } from "react";
import { Card, Typography, Row, Col, Input, Button, Divider } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const JoinGame = () => {

    const navigate = useNavigate();

    const [roomId, setRoomId] = useState<string>("");

    return (
        <>
            <Card
                style={{height: "100%"}}
            >
                
                <Title level={3}>Join a game with a code</Title>

                <Divider/>

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
                                onPressEnter={() => navigate(`/play/${roomId}`)}
                            />
                        </Input.Group>
                    </Col>

                    <Col>
                        <Button
                            type="primary"
                            onClick={() => navigate(`/play/${roomId}`)}
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