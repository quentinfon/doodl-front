import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import GamePage from './route/GamePage';
import HomePage from './route/HomePage';
import { Layout, Row, Col } from 'antd';
import { Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';

const { Title } = Typography;

const { Header, Footer, Sider, Content } = Layout;

const App = () => {

    return (
        <Router>

            <Layout>
                <Header>
                    <nav className="menuBar">
                        <div className="logo">
                            <a href="">
                                        <Avatar 
                                            src="/logo.png"
                                        />
                            </a>
                        </div>                    
                    </nav>
                </Header>
                <Content>
                    
                <Routes>
            
                    <Route path="/play/:gameId" element={<GamePage/>}/>
                    
                    <Route path="/" element={<HomePage/>}/>

                </Routes>

                </Content>
                <Footer>Footer</Footer>
            </Layout>

        </Router>
    );
}

export default App;
