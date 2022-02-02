import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import GamePage from './route/GamePage';
import HomePage from './route/HomePage';
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const App = () => {

    return (
        <Router>

            <Layout>
                <Header>Header</Header>
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
