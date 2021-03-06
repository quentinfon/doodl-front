import React, {useState} from "react";
import {Button, Card, Col, Collapse, Input, List, message, Popconfirm, Row, Statistic} from 'antd';
import {
    AdminSocketChannel,
    IAdminRoomInfo,
    IAdminSocketConnectResponse,
    IAdminSocketMessageRequest
} from "../types/AdminSocketModel";

const {Panel} = Collapse;
const {Search} = Input;

const AdminPage = () => {

    const [userNumber, setUserNumber] = useState<number>(0);
    const [roomNumber, setRoomNumber] = useState<number>(0);
    const [drawNumber, setDrawNumber] = useState<number>(0);
    const [connected, setConnected] = useState<boolean>(false);
    const [rooms, setRooms] = useState<IAdminRoomInfo[]>([]);
    const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timer>();
    const [adminWs, setAdminWs] = useState<WebSocket>();

    const sendAdminMessage = (message: IAdminSocketMessageRequest) => {
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

            setRefreshInterval(setInterval(() => {
                webSocket.send(JSON.stringify({channel: AdminSocketChannel.GLOBAL_DATA}))
            }, 5 * 1000))
        };

        webSocket.onclose = () => {
            setAdminWs(undefined);
            setConnected(false);

            if (refreshInterval) {
                clearInterval(refreshInterval);
                setRefreshInterval(undefined);
            }
        }

        webSocket.onmessage = e => {
            let init: IAdminSocketConnectResponse = JSON.parse(e.data);
            if (init.channel == AdminSocketChannel.GLOBAL_DATA) {
                setRooms(init.data.roomList);
                updateStats(init.data.roomCount, init.data.wsCount, init.data.drawCount);
            }
        };
    }

    const explicit = (roomInfo: IAdminRoomInfo) => {
        if (!roomInfo) return [];

        let items = []
        items.push(<List.Item key={"rommheader" + roomInfo.roomId}>
            <span>{"RoomID : " + roomInfo.roomId}</span>
        </List.Item>)
        
        for (let i = 0; i < roomInfo.playerList.length; i++) {
            items.push(
                <List.Item key={"room" + roomInfo.roomId + "-" + i}>
                    {roomInfo.playerList[i].name + " "}{
                    <Popconfirm title={"DO YOU REALLY WANT TO KICK THIS PLAYER ?"}
                                onConfirm={() => playerSuppression(roomInfo.playerList[i].playerId, roomInfo.roomId)}
                                okText="Yes" cancelText="No">
                        <Button danger type="primary" shape="circle" size="small">
                            X
                        </Button>
                    </Popconfirm>
                }
                </List.Item>)
        }
        return (
            <>
                <List bordered>
                    {items}
                </List>
            </>
        )
    }

    const playerSuppression = (playerId: string, roomId: string) => {
        sendAdminMessage({
            channel: AdminSocketChannel.KICK_PLAYER,
            data: {
                playerId: playerId,
                roomId: roomId
            }
        });
        adminWs?.send(JSON.stringify({channel: AdminSocketChannel.GLOBAL_DATA}))
        message.success('Player Deleted :)');
    }

    const roomSuppression = (roomId: string) => {
        sendAdminMessage({
            channel: AdminSocketChannel.DELETE_ROOM,
            data: {
                roomId: roomId as string
            }
        });
        adminWs?.send(JSON.stringify({channel: AdminSocketChannel.GLOBAL_DATA}))
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
                        <span>{explicit(rooms[i])}</span>
                    </Panel>
                </Collapse>
            </Col>
        )
    }

    const render = () => {
        const items = []
        for (let i = 0; i < roomNumber; i += 4) {
            items.push(<Row key={i}>
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
        return (
            <div>
                <Row justify={"center"}>
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
        if (drawNumber > 1) {
            return "draws";
        } else {
            return "draw"
        }
    }

    function stats() {
        return (
            <div className="site-statistic-demo-card">
                <Row justify={"center"}>
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
        )
    }

    return (
        <>
            <br/>
            {!connected && connectionInput()}
            {connected && stats()},
            {connected && rooms.length > 0 && render()}
        </>
    )
}

export default AdminPage;