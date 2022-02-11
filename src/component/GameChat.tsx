import { Avatar, List, Card, Comment, Input, Button} from "antd";
import React, { useState } from "react";
import { ISocketMessageRequest, IDataChatResponse, SocketChannel } from "../types/message";

const { TextArea } = Input;

interface GameChatProps {
    messages: IDataChatResponse[],
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
        // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
        if (event.key === 'Enter') {
            sendCurrentMsg()
        }
    }

    // @ts-ignore
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
                    renderItem={(msg: IDataChatResponse, idx: number) => (
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
                            <form >
                                <TextArea
                                    onKeyDown={onKeyDown}
                                    rows={3}
                                    onChange={(e: any) => setCurrentMessage(e.target.value)}
                                    value={currentMsg}
                                />
                                <Button onClick={sendCurrentMsg} onKeyDown={onKeyDown}>Send</Button>
                            </form>
                        }
                    />
                </Card>
            </div>
        
        </>
    )
}

export default GameChat;