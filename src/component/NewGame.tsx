import { Button, Card, Row, Col } from "antd";
import React from "react";
import { Typography, Input } from 'antd';

const { Title, Text } = Typography;

const NewGame = () => {

    return (
        <>
            <Card>
                <Title level={3}>Create a game</Title>

                <Row>
                    <Col span={6}>
                        <Text>Rounds</Text>
                        <Input></Input>
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