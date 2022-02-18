import {Avatar, Button, Card, Col, Comment, Form, Input, List, Row} from "antd";
import React, {useEffect, useState} from "react";
import {IMessage, IPlayer} from "../types/GameModel";
import {GameSocketChannel, ISocketMessageRequest} from "../types/SocketModel";

interface GameChatProps {
    messages: IMessage[],
    sendMessage: (message: ISocketMessageRequest) => any,
    player: IPlayer | undefined
}

const GameChat = ({
                      messages,
                      sendMessage,
                      player
                  }: GameChatProps) => {

    const [currentMsg, setCurrentMessage] = useState<string>("");
    const LIST_ID = "game-chat-list";


    const [chatHeight, setChatHeight] = useState<number>(window.innerHeight - 200);

    useEffect(() => {
        setChatHeight(window.innerHeight - 200);
    }, [window.innerHeight])

    useEffect(autoScrollBottomChat, [messages]);
    useEffect(autoScrollBottomChat);

    function autoScrollBottomChat() {
        const list = document.getElementById(LIST_ID);
        if (list) {
            list.scrollTop = list.scrollHeight;
        }
    }

    const sendCurrentMsg = () => {
        if (!currentMsg) return;

        sendMessage({
            channel: GameSocketChannel.CHAT,
            data: {
                message: currentMsg
            }
        });

        setCurrentMessage("");
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendCurrentMsg()
        }
    }

    return (
        <>
            <div
                style={{
                    height: chatHeight + 'px'
                }}
            >
                <List
                    id={LIST_ID}
                    dataSource={messages}
                    style={{
                        overflowY: "scroll",
                        overflowX: "hidden",
                        maxHeight: "100%"
                    }}
                    renderItem={(msg: IMessage, idx: number) => (
                        <Card
                            size="small"
                        >
                            <List.Item key={idx}>
                                <List.Item.Meta
                                    avatar={<Avatar src={msg.author.imgUrl}/>}
                                    title={<>{msg.author.name}</>}
                                    description={msg.message}
                                />
                            </List.Item>
                        </Card>
                    )}
                />
            </div>
            <div>
                <Card
                    size="small"
                >
                    <Comment
                        avatar={<Avatar src={player?.imgUrl}/>}
                        content={
                            <Form.Item>
                                <Row>
                                    <Col span={20}>
                                        <Input
                                            type={'text'}
                                            onKeyDown={onKeyDown}
                                            onChange={(e: any) => setCurrentMessage(e.target.value)}
                                            value={currentMsg}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <Button onClick={sendCurrentMsg} onKeyDown={onKeyDown}>Send</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        }
                    />
                </Card>
            </div>
        </>
    )
}

export default GameChat;