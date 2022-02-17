import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes,} from "react-router-dom";
import GamePage from './route/GamePage';
import HomePage from './route/HomePage';
import {Layout} from 'antd';
import AppHeader from "./component/Layout/AppHeader";

const {Content, Footer} = Layout;

const App = () => {

    return (
        <Router>
            <AppHeader/>

            <Layout>
                <Content
                    style={{
                        height: "100%"
                    }}
                >
                    <Routes>
                        <Route path="/play/:gameId" element={<GamePage/>}/>
                        <Route path="/" element={<HomePage/>}/>
                        <Route
                            path="*"
                            element={<Navigate to="/"/>}
                        />
                    </Routes>
                </Content>
                <Footer>

                </Footer>
            </Layout>
        </Router>
    );
}

export default App;
