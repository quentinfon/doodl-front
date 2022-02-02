import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Row, Col } from 'antd';
import { GameMessage, SocketMessage } from "../types/message";
import GameChat from "../component/GameChat";

const { Header, Footer, Sider, Content } = Layout;

const GamePage = () => {

    const { gameId } = useParams<{gameId: string}>();

    const [ws, setWs] = useState<WebSocket>();

    useEffect(() => {
        let webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_ENDPOINT as string);
        webSocket.onopen = () => console.log('ws opened');
        webSocket.onclose = () => console.log('ws closed');
    
        webSocket.onmessage = e => {
          if (webSocket) return;
          const message = JSON.parse(e.data);
          console.log('e', message);
        };
    
        setWs(webSocket);

        return () => {
            webSocket.close();
        }
    }, []);

    const sendMessage = (message: SocketMessage) => {
        ws?.send(JSON.stringify(message));
    }

    const fakeMsg : GameMessage[] = [
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },

        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde'
        },
        {
            authorImg: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png',
            author: 'Bob',
            message: 'Salut tout le monde ferfeeeeeeeeeeeeeeeeehb hbjhre bfjhrebfnjhr ebnfhjubn ferhjuf '
        }
    ]

    return (
        <>

            Id de la partie : {gameId}

            <Layout>
                <Header>Header</Header>
                <Layout>
                    <Content>
                        <Row>
                            <Col span={18}>


                            </Col>

                            <Col span={6}>
                                <GameChat 
                                    messages={fakeMsg}
                                    sendMessage={sendMessage}
                                />
                            </Col>
                        </Row>

                    </Content>
                  
                </Layout>
                <Footer>Footer</Footer>
            </Layout>
        
        </>
    )
}

export default GamePage;