import React from "react";
import { useParams } from "react-router-dom";
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const GamePage = () => {

    const { gameId } = useParams<{gameId: string}>();

    return (
        <>

            Id de la partie : {gameId}

            <Layout>
                <Header>Header</Header>
                <Layout>
                    <Content>Content</Content>
                    <Sider
                        collapsible
                    >
                        Sider
                    </Sider>
                </Layout>
                <Footer>Footer</Footer>
            </Layout>
        
        </>
    )
}

export default GamePage;