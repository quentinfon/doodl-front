import { Card, Col, Divider, Row } from "antd";
import React from "react";
import JoinGame from "../component/JoinGame";
import NewGame from "../component/NewGame";

const HomePage = () => {

    return (
        <>

            <Row
                style={{
                    marginTop: "5%"
                }}
            >
                <Col span={20} offset={2}>
                    <NewGame />
                </Col>
            </Row>

            <Divider> Or </Divider>

            <Row
                style={{
                    marginTop: "5%"
                }}
            >
                <Col span={20} offset={2}>
                    <JoinGame />
                </Col>
            </Row>
        
        </>
    )
}

export default HomePage;