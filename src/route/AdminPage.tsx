// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {useEffect, useState} from "react";
import { Statistic, Row, Col, Card, Input, Button, Popconfirm, message, List} from 'antd';
import { Collapse } from 'antd';
import {ISocketMessageRequest} from "../types/SocketModel";
import {
    AdminSocketChannel,
    IAdminRoomInfo,
    IAdminSocketConnectResponse
} from "../types/AdminSocketModel";
const { Panel } = Collapse;
const { Search } = Input;

const {Panel} = Collapse;
const {Search} = Input;

const AdminPage = () => {

    const [userNumber, setUserNumber] = useState<number>(0);
    const [roomNumber, setRoomNumber] = useState<number>(0);
    const [drawNumber, setDrawNumber] = useState<number>(0);
    const [connected, setConnected] = useState<boolean>(false);
    const [rooms, setRooms] = useState<IAdminRoomInfo[]>([]);
    const [pingInterval, setPingInterval] = useState<NodeJS.Timer>();

    const [adminWs, setAdminWs] = useState<WebSocket>();

    const sendMessage = (message: ISocketMessageRequest) => {
        adminWs?.send(JSON.stringify(message));
    }

    function updateStats(roomCount: number, wsCount: number, drawCount: number) {
        setUserNumber(wsCount);
        setRoomNumber(roomCount);
        setDrawNumber(drawCount);
    }

    const createSocket = (value: String) => {
        let webSocket = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_ENDPOINT_ADMIN}?token=${value}` as string);


        webSocket.onopen = () => {
            setAdminWs(webSocket);
            setConnected(true);

            setPingInterval(setInterval(() => {
                webSocket.send(JSON.stringify({channel: AdminSocketChannel.GLOBAL_DATA}))
            }, 5 * 1000))

        };

        webSocket.onclose = () => {
            console.debug("Socket closed");
            setAdminWs(undefined);
            if (pingInterval) {
                clearInterval(pingInterval);
                setPingInterval(undefined);
            }
        }

        webSocket.onmessage = e => {
            console.log('e', JSON.parse(e.data));
            let msg: ISocketMessageResponse = JSON.parse(e.data);
            let init: IDataInitAdminResponse = msg.data as IDataInitAdminResponse;
            console.log(init.roomCount)
            setRooms(init.roomList);
            updateStats(init.roomCount, init.wsCount, init.drawCount);
        };
    }

    const explicit = (roomInfo : IAdminRoomInfo) => {
        console.log(roomInfo)
        let items = []
        items.push(<List.Item><p>{"RoomID : " + roomInfo.roomId}</p></List.Item>)
        for(let i=0; i<roomInfo.playerList.length; i++){
            items.push(<List.Item><p>{roomInfo.playerList[i].name + " "}{<Popconfirm  title={"DO YOU REALLY WANT TO KICK THIS PLAYER ?"} onConfirm={() => playerSuppression(roomInfo.playerList[i].playerId)} okText="Yes" cancelText="No">
                <Button danger type="primary" shape="circle" size="small">
                    X
                </Button>
            </Popconfirm>}</p></List.Item>)
        }
        return (
            <>
                <List bordered>
                    {items}
                </List>
            </>
        )
    }

    const playerSuppression = (playerId:String) => {
        message.success('Player Deleted :)');
    }

    const roomSuppression = (roomId : string) => {
        message.success('Room deleted :)');
    }

    function card(i: number) {
        return (
            <Col span={6}>
                <Collapse>
                    <Panel header={"Room " + i.toString()} key={i} extra={
                        <div onClick={e => e.stopPropagation()}>
                            <Popconfirm title={"DO YOU REALLY WANT TO SUPPRESS THIS ROOM ?"}
                                        onConfirm={() => roomSuppression(rooms[i].roomId)} okText="Yes" cancelText="No">
                                <Button danger type="primary" shape="circle" size="small">
                                    X
                                </Button>
                            </Popconfirm>
                        </div>
                    }>
                        <p>{explicit(rooms[i])}</p>
                    </Panel>
                </Collapse>
            </Col>
        )
    }

    const render = () => {

        const items = []
        console.log(rooms[0])
        for (let i = 0; i < roomNumber; i += 4) {
            items.push(<Row>
                {i < roomNumber &&
                    card(i)
                }
                {i + 1 < roomNumber &&
                    card(i + 1)
                }
                {i + 2 < roomNumber &&
                    card(i + 2)
                }
                {i + 3 < roomNumber &&
                    card(i + 3)
                }
            </Row>)
        }

        return (
            items
        );
    }


    const tryGetAdminRights = (value: string) => {
        createSocket(value);
    }

    const userName = () => {
        if (userNumber > 1) {
            return "users";
        } else {
            return "user"
        }
    }
    const roomName = () => {
        if (roomNumber > 1) {
            return "rooms";
        } else {
            return "room"
        }
    }

    function connectionInput() {
        return(
            <div>
                <Row gutter={14}>
                    <Col span={9}/>
                    <Col span={6}>
                        <Search
                            type={"password"}
                            placeholder="password"
                            allowClear
                            enterButton="Connect"
                            size="large"
                            onSearch={tryGetAdminRights}
                        />
                    </Col>
                </Row>
                <br/>
            </div>
        );
    }
    const drawName = () => {
        if(drawNumber>1){
            return "draws";
        }else{
            return "draw"
        }
    }
    return (
        <>
            <br/>
            {!connected && connectionInput()}
            <div className="site-statistic-demo-card">
                <Row gutter={16}>
                    <Col span={6}/>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="Active users"
                                value={userNumber}
                                precision={0}
                                valueStyle={{color: '#3f8600'}}
                                suffix={userName()}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="Active rooms"
                                value={roomNumber}
                                precision={0}
                                valueStyle={{color: '#3f8600'}}
                                suffix={roomName()}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card>
                            <Statistic
                                title="Draw Count"
                                value={drawNumber}
                                precision={0}
                                valueStyle={{color: '#3f8600'}}
                                suffix={drawName()}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
            ,
            {render()}
        </>
    )
}

export default AdminPage;