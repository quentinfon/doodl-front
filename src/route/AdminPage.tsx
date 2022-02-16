import React, {useEffect, useState} from "react";
import { Statistic, Row, Col, Card, Input} from 'antd';
import {IDataInitResponse, ISocketMessageResponse, SocketChannel} from "../types/SocketModel";
import {IMessage} from "../types/GameModel";

const { Search } = Input;


const AdminPage = () => {

    const [adminWs, setAdminWs] = useState<WebSocket>();
    const [loadingConnexion, setLoadingConnexion] = useState<boolean>(false);

    const createSocket = (value : String) => {
        let webSocket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_ENDPOINT_ADMIN}?token=${value}` as string);

        setLoadingConnexion(true);

        webSocket.onopen = () => {
            setAdminWs(webSocket);
            setLoadingConnexion(false);
            console.log("CONNECTED")
        };

        webSocket.onclose = () => {
            console.debug("Socket closed");
            setAdminWs(undefined);
        }

        webSocket.onmessage = e => {
            console.log(e)
        };
    }


    const onSearch = (value: string) => createSocket(value);
    return (
        <>
            <br></br>
            <div>
                <Row gutter={14}>
                    <Col span={9}></Col>
                    <Col span={6}>
                        <Search
                            placeholder="input search text"
                            allowClear
                            enterButton="Search"
                            size="large"
                            onSearch={onSearch}
                        />
                    </Col>
                </Row>
            </div>
            <br></br>
            <div className="site-statistic-demo-card">
                <Row gutter={16}>
                    <Col span={6}></Col>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="Active users"
                                value={0}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                suffix="users"
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="Active rooms"
                                value={0}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                suffix="rooms"
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="Delay"
                                value={0}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                suffix="ms"
                            />
                        </Card>
                    </Col>
                </Row>
            </div>,
        </>
    )
}

export default AdminPage;