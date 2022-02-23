import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes,} from "react-router-dom";
import GamePage from './route/GamePage';
import HomePage from './route/HomePage';
import AdminPage from "./route/AdminPage";
import {Layout} from 'antd';
import AppHeader from "./component/Layout/AppHeader";

const {Content, Footer} = Layout;

const App = () => {

    return (
        <Router>
            <Layout style={{minHeight: "90vh"}}>
                <AppHeader/>

                <Content>
                    <Routes>
                        <Route path="/play/:gameId" element={<GamePage/>}/>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/admin" element={<AdminPage/>}/>
                        <Route
                            path="*"
                            element={<Navigate to="/"/>}
                        />
                    </Routes>
                </Content>
                
                <Footer/>
            </Layout>
        </Router>
    );
}

export default App;
