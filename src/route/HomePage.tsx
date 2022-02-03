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
                justify="center"
            >
                <Col lg={10} md={20} sm={24}>
                    <JoinGame />
                </Col>

                <Col lg={10} md={20} sm={24}>                    
                    <NewGame />
                </Col>

            </Row>

        
        </>
    )
}

export default HomePage;