import { Avatar, List, Card, Comment, Form, Input, Button, Row } from "antd";
import React, { useState } from "react";
import { IMessage } from "../types/GameModel";
import { ISocketMessageRequest, SocketChannel } from "../types/SocketModel";

const { TextArea } = Input;

interface GameChatProps {
    messages: IMessage[],
    sendMessage: (message: ISocketMessageRequest) => any
}

const GameChat = ({
    messages,
    sendMessage
}: GameChatProps) => {

    const [currentMsg, setCurrentMessage] = useState<string>("");

    const sendCurrentMsg = () => {
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
                                    avatar={<Avatar src={msg.author.imgUrl} />}
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
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                        content={
                            <Form.Item>
                                <TextArea
                                    rows={3}
                                    onKeyDown={onKeyDown}
                                    onChange={(e: any) => setCurrentMessage(e.target.value)}
                                    value={currentMsg}
                                />
                                <Button onClick={sendCurrentMsg}>Send</Button>
                            </Form.Item>
                        }
                    />
                </Card>
            </div>

        </>
    )
}

export default GameChat;