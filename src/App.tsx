import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import GamePage from './route/GamePage';
import HomePage from './route/HomePage';
import { Layout } from 'antd';
import { Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';

const { Title } = Typography;

const { Header, Footer, Sider, Content } = Layout;

const App = () => {

    return (
        <Router>

            <Layout>
                    <nav>
                        <ul className={"Menu"}>
                            <li className="MenuElement" ><a href="">
                                <Avatar
                                    src="/logo.png"
                                />
                            </a></li>
                            <li><a className={"MenuElement"} href="">Gitlab</a></li>
                            <li><a className={"MenuElement"} href="">Contact</a></li>
                            <li><a className={"MenuElement"} href="">A propos</a></li>
                            <li className={"MenuElement share"}><a href="">Partager la partie</a></li>
                        </ul>
                    </nav>
                <Content>

                    
                <Routes>
            
                    <Route path="/play/:gameId" element={<GamePage/>}/>
                    
                    <Route path="/" element={<HomePage/>}/>

                    <Route
                        path="*"
                        element={<Navigate to="/" />}
                    />

                </Routes>

                </Content>
                <Footer className="Footer">Footer</Footer>
            </Layout>

        </Router>
    );
}

export default App;
