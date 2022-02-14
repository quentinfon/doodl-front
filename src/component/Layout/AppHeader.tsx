import {Menu} from "antd";
import React from "react";
import {Header} from "antd/lib/layout/layout";

import './AppHeader.css';
import {Link} from "react-router-dom";

export default function AppHeader() {
    return (
        <Header>
            <div>
                <Link to="/">
                    <img className="logo" src={process.env.PUBLIC_URL + "/logo.png"} alt="logo"/>
                </Link>
            </div>

            <Menu theme="dark" mode="horizontal">
                <Menu.Item key="home">
                    <Link to="/">
                        <span className="nav-text">Home</span>
                    </Link>
                </Menu.Item>
            </Menu>
        </Header>
    )
}