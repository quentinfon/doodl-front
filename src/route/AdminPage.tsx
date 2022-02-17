import React, {useEffect, useState} from "react";
import { Statistic, Row, Col, Card, Input} from 'antd';
import { Collapse } from 'antd';
import {
    IDataInitAdminResponse,
    IDataInitResponse,
    ISocketMessageRequest,
    ISocketMessageResponse,
    SocketChannel
} from "../types/SocketModel";
import parse from "html-react-parser";
const { Panel } = Collapse;
const { Search } = Input;

const AdminPage = () => {

    const [userNumber, setUserNumber] = useState<number>(0);
    const [roomNumber, setRoomNumber] = useState<number>(0);

    const [adminWs, setAdminWs] = useState<WebSocket>();
    const [loadingConnexion, setLoadingConnexion] = useState<boolean>(false);

    const sendMessage = (message: ISocketMessageRequest) => {
        adminWs?.send(JSON.stringify(message));
    }

    function updateStats(roomCount: number, wsCount: number) {
        setUserNumber(wsCount);
        setRoomNumber(roomCount);
    }

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
            console.log('e', JSON.parse(e.data));
            let msg: ISocketMessageResponse = JSON.parse(e.data);
            let init: IDataInitAdminResponse = msg.data as IDataInitAdminResponse;
            updateStats(init.roomCount,init.wsCount);
        };
    }

    const detailPartie = "detail partie"

     const callback = (key:String) => {
        console.log(key);
         /*sendMessage({
             channel: SocketChannel.CHAT,
             data: {
                 message: currentMsg
             }
         });*/
    }

    const render = () => {

        return (
            <Row>
                <Col span={6}>
                    <Collapse>
                        <Panel header="This is panel header 1" key="1">
                            <p>{detailPartie}</p>
                        </Panel>
                    </Collapse>
                </Col>
                <Col span={6}>
                    <Collapse>
                        <Panel header="This is panel header 1" key="1">
                            <p>{detailPartie}</p>
                        </Panel>
                    </Collapse>
                </Col>
                <Col span={6}>
                    <Collapse>
                        <Panel header="This is panel header 1" key="1">
                            <p>{detailPartie}</p>
                        </Panel>
                    </Collapse>
                </Col>
                <Col span={6}>
                    <Collapse>
                        <Panel header="This is panel header 1" key="1">
                            <p>{detailPartie}</p>
                        </Panel>
                    </Collapse>
                </Col>
            </Row>
        );
    }


    const onSearch = (value: string) => {
        createSocket(value);
    }

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
                                value={userNumber}
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
                                value={roomNumber}
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
            {render()}
        </>
    )
}

export default AdminPage;