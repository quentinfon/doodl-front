import { Avatar, List, Card, Comment, Form, Input } from "antd";
import React, { useState } from "react";
import { GameMessage } from "../types/message";

const { TextArea } = Input;

interface GameChatProps {
    messages: GameMessage[]
}

const GameChat = ({
    messages
}: GameChatProps) => {

    const [currentMsg, setCurrentMessage] = useState<string>("");

    return (
        <>
        
            <div
                style={{
                    height: "700px"
                }}
            >
                <List
                    dataSource={messages}
                    style={{
                        overflow: "scroll",
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
                            </Form.Item>
                        }
                    />
                 </Card>
            </div>
        
        </>
    )
}

export default GameChat;