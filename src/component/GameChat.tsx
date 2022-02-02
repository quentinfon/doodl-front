import { Avatar, List, Card, Comment, Form, Input, Button, Row } from "antd";
import React, { useState } from "react";
import { GameMessage, SocketMessage } from "../types/message";

const { TextArea } = Input;

interface GameChatProps {
    messages: GameMessage[],
    sendMessage: (message: SocketMessage) => any
}

const GameChat = ({
    messages,
    sendMessage
}: GameChatProps) => {

    const [currentMsg, setCurrentMessage] = useState<string>("");

    const sendCurrentMsg = () => {
        sendMessage({
            channel: "chat",
            data: currentMsg
        });
        setCurrentMessage("");
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
                    renderItem={(msg: GameMessage, idx: number) => (
                        <Card 
                            size="small"
                        >
                            <List.Item key={idx}>
                                <List.Item.Meta
                                    avatar={<Avatar src={msg.authorImg} />}
                                    title={<>{msg.author}</>}
                                    description={msg.message}
                                />
                            </List.Item>
                        </Card>
                    )}
                />
            </div>
            <div>
                 <Card>
                    <Comment
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                        content={
                            <Form.Item>
                                <TextArea 
                                    rows={3} 
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