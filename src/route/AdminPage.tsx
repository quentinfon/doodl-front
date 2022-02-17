import React, {useEffect, useState} from "react";
import { Statistic, Row, Col, Card, Input, Button} from 'antd';
import { Collapse } from 'antd';
import {
    IDataInitAdminResponse,
    IDataInitResponse,
    ISocketMessageRequest,
    ISocketMessageResponse,
    SocketChannel
} from "../types/SocketModel";
import parse from "html-react-parser";
import {IRoomInfo} from "../types/GameModel";
const { Panel } = Collapse;
const { Search } = Input;

const AdminPage = () => {

    const [userNumber, setUserNumber] = useState<number>(0);
    const [roomNumber, setRoomNumber] = useState<number>(0);
    const [rooms, setRooms] = useState<IRoomInfo[]>([]);

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
            setRooms(init.roomList);
            updateStats(init.roomCount,init.wsCount);
        };
    }

    const detailPartie = "detail partie"

    const explicite = (roomInfo : IRoomInfo) => {
        console.log(roomInfo)
        let items = []
        items.push(<p>{"RoomID : " + roomInfo.roomId}</p>)
        items.push(<p>Joueurs : </p>)
        for(let i=0; i<roomInfo.playerList.length; i++){
            items.push(<p>{roomInfo.playerList[i].name}</p>)
        }
        return items
    }

     const callback = (key:String) => {
        console.log(key);
         /*sendMessage({
             channel: SocketChannel.CHAT,
             data: {
                 message: currentMsg
             }
         });*/
    }

    const pannelClick = () => {
        alert("clicked")
    }

    const render = () => {

        const items = []
        console.log(rooms[0])
        for(let i=0;i<roomNumber;i+=4){
            items.push(<Row>
                {i<roomNumber &&
                <Col span={6}>
                    <Collapse >
                        <Panel header={"Room " + i.toString()} key={i} extra={
                            <div onClick={e => e.stopPropagation()}>
                                <Button danger type="primary" shape="circle" size="small" onClick={pannelClick}>
                                    X
                                </Button>
                            </div>
                        }>
                            <p>{explicite(rooms[i])}</p>
                        </Panel>
                    </Collapse>
                </Col>
                }
                {i + 1 < roomNumber &&
                    <Col span={6}>
                        <Collapse>
                            <Panel header={"Room " + (i+1).toString()} key={i+1} extra={
                                <div onClick={e => e.stopPropagation()}>
                                    <Button danger type="primary" shape="circle" size="small" onClick={pannelClick}>
                                        X
                                    </Button>
                                </div>
                            }>
                                <p>{explicite(rooms[i+1])}</p>
                            </Panel>
                        </Collapse>
                    </Col>
                }
                {i + 2 < roomNumber &&
                <Col span={6}>
                    <Collapse>
                        <Panel header={"Room " + (i+2).toString()} key={i+2} extra={
                            <div onClick={e => e.stopPropagation()}>
                                <Button danger type="primary" shape="circle" size="small" onClick={pannelClick}>
                                    X
                                </Button>
                            </div>
                        }>
                            <p>{explicite(rooms[i+2])}</p>
                        </Panel>
                    </Collapse>
                </Col>
                }
                {i + 3 < roomNumber &&
                    <Col span={6}>
                        <Collapse>
                            <Panel header={"Room " + (i+3).toString()} key={i+3} extra={
                                <div onClick={e => e.stopPropagation()}>
                                    <Button danger type="primary" shape="circle" size="small" onClick={pannelClick}>
                                        X
                                    </Button>
                                </div>
                            }>
                                <p>{explicite(rooms[i+3])}</p>
                            </Panel>
                        </Collapse>
                    </Col>
                }
            </Row>)
        }

        return (
            items
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