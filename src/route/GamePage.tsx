import React from "react";
import { useParams } from "react-router-dom";
import { Layout, Row, Col } from 'antd';
import { GameMessage } from "../types/message";
import GameChat from "../component/GameChat";

const { Header, Footer, Sider, Content } = Layout;

const GamePage = () => {

    const { gameId } = useParams<{gameId: string}>();

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
                                <GameChat messages={fakeMsg} />
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