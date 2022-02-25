import {Avatar, Button, Card, Input, List, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {IMessage} from "../types/GameModel";
import {GameSocketChannel, ISocketMessageRequest} from "../types/GameSocketModel";
import {EyeOutlined, SendOutlined} from '@ant-design/icons';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

interface GameChatProps {
    messages: IMessage[],
    sendMessage: (message: ISocketMessageRequest) => any,
    chatHeight: number
}

const GameChat = ({
                      messages,
                      sendMessage,
                      chatHeight
                  }: GameChatProps) => {

    const scrollbarRef = React.useRef<SimpleBar>(null);

    const [currentMsg, setCurrentMessage] = useState<string>("");

    useEffect(autoScrollBottomChat, [messages]);
    useEffect(autoScrollBottomChat);

    function autoScrollBottomChat() {
        const scrollBar = scrollbarRef.current?.getScrollElement();
        if (scrollBar) {
            // scrollBar.scrollTop = scrollBar.scrollHeight;
            scrollBar.scroll({top: scrollBar.scrollHeight, behavior: 'smooth'});
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
            <Card
                size="small"
            >
                <SimpleBar
                    ref={scrollbarRef}
                    style={{
                        height: chatHeight + 'px'
                    }}
                >
                    <List
                        dataSource={messages}
                        renderItem={(msg: IMessage, idx: number) => (
                            <Card
                                size="small"
                                style={{
                                    background: msg.isSpectator ? "rgba(242,242,242,0.6)" : ""
                                }}
                            >
                                {msg.isSpectator ?
                                    <List.Item key={idx} style={{padding: "0px"}}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={msg.author.imgUrl}/>}
                                            title={<>{msg.author.name} <EyeOutlined/></>}
                                            description={<i>{msg.message}</i>}
                                            style={{wordBreak: "break-all"}}
                                        />
                                    </List.Item>
                                    :
                                    <List.Item key={idx} style={{padding: "0px"}}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={msg.author.imgUrl}/>}
                                            title={<>{msg.author.name}</>}
                                            description={msg.message}
                                            style={{wordBreak: "break-all"}}
                                        />
                                    </List.Item>
                                }

                            </Card>
                        )}
                    />
                </SimpleBar>

                <div
                    style={{
                        marginTop: "16px",
                        marginBottom: "8px"
                    }}
                >
                    <Input.Group
                        style={{width: "100%"}}
                    >
                        <Input
                            style={{width: 'calc(100% - 32px)'}}
                            onKeyDown={onKeyDown}
                            onChange={(e: any) => setCurrentMessage(e.target.value)}
                            value={currentMsg}
                        />
                        <Tooltip title="Send message">
                            <Button
                                onClick={sendCurrentMsg}
                                onKeyDown={onKeyDown}
                                icon={<SendOutlined/>}
                            />
                        </Tooltip>
                    </Input.Group>
                </div>

            </Card>
        </>
    )
}

export default GameChat;