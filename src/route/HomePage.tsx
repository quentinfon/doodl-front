import React from "react";
import JoinGame from "../component/JoinGame";
import NewGame from "../component/NewGame";

import { Statistic, Row, Col, Card } from 'antd';
import {ArrowUpOutlined, ArrowDownOutlined, BgColorsOutlined} from '@ant-design/icons';

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
                    <JoinGame/>
                </Col>

                <Col lg={10} md={20} sm={24}>
                    <NewGame/>
                </Col>
            </Row>
        </>
    )
}

export default HomePage;