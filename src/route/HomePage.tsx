import React from "react";
import JoinGame from "../component/JoinGame";
import NewGame from "../component/NewGame";

import {Col, Row} from 'antd';

const HomePage = () => {
    return (
        <>
            <Row
                style={{
                    marginTop: "5%"
                }}
                justify="space-around"
            >
                <Col xs={24} md={20} lg={10}>
                    <JoinGame/>
                </Col>

                <Col xs={24} md={20} lg={10}>
                    <NewGame/>
                </Col>
            </Row>
        </>
    )
}

export default HomePage;