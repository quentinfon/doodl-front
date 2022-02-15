import {Avatar, Button, Card, Comment, Form, Input, List, ListProps} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {IMessage} from "../types/GameModel";
import {ISocketMessageRequest, SocketChannel} from "../types/SocketModel";

const {TextArea} = Input;

interface GameChatProps {
    messages: IMessage[],
    sendMessage: (message: ISocketMessageRequest) => any
}

const GameChat = ({
                      messages,
                      sendMessage
                  }: GameChatProps) => {

    const [currentMsg, setCurrentMessage] = useState<string>("");
    const LIST_ID = "game-chat-list";

    useEffect(() => {
        const list = document.getElementById(LIST_ID);
        if (list) {
            list.scrollTop = list.scrollHeight;
        }
    }, [messages]);

    const sendCurrentMsg = () => {
        if (!currentMsg) return;

        sendMessage({
            channel: SocketChannel.CHAT,
            data: {
                message: currentMsg
            }
        });

        setCurrentMessage("");
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendCurrentMsg()
        }
    }

    return (
        <>
            <div
                style={{
                    height: "500px"
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
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo"/>}
                        content={
                            <Form.Item>
                                <TextArea
                                    rows={3}
                                    onKeyDown={onKeyDown}
                                    onChange={(e: any) => setCurrentMessage(e.target.value)}
                                    value={currentMsg}
                                />
                                <Button onClick={sendCurrentMsg} onKeyDown={onKeyDown}>Send</Button>
                            </Form.Item>
                        }
                    />
                </Card>
            </div>
        </>
    )
}

export default GameChat;