import { Card, Typography, Row, Col, Input, Button, Divider } from "antd";
import React from "react";

const { Title, Text } = Typography;

const JoinGame = () => {

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
                            <Input />
                        </Input.Group>
                    </Col>

                    <Col>
                        <Button
                            type="primary"
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