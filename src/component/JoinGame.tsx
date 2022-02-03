import { Card, Typography, Row, Col, Input, Button } from "antd";
import React from "react";

const { Title, Text } = Typography;

const JoinGame = () => {

    return (
        <>
            <Card>

                <Title level={3}>Join a game with a code</Title>

                <Row 
                    gutter={20}
                    style={{
                        marginBottom: 20
                    }}
                >
                    <Col sm={24} md={12} lg={6}>
                        <Text>Max players</Text>
                        <Input.Group
                            style={{ width: "100%" }}
                        >
                            <Input />
                        </Input.Group>
                    </Col>

                </Row>

                <Row justify="end">
                    <Button
                        type="primary"
                    >
                        Join
                    </Button>
                </Row>
                     
            </Card>
        </>
    )
}

export default JoinGame;