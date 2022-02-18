import {Layout, Menu} from "antd";
import { message, Button, Space } from 'antd';
import React from "react";
import {Header} from "antd/lib/layout/layout";

import './AppHeader.css';
import {Link} from "react-router-dom";
import Sider from "antd/lib/layout/Sider";

const copyPageLink = async () => {
    navigator.clipboard.writeText(window.location.href)
    if (await navigator.clipboard.readText() == window.location.href) {
        copied()
    }else{
        notCopied()
    }
}

const copied = () => {
    message.success('Link has succesfully been copied');
}

const notCopied = () => {
    message.error('Link has not been copied')
};

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

                <Menu.Item key="share">
                    <Button type="primary" onClick={copyPageLink} >
                        Copier le lien
                    </Button>
                </Menu.Item>
            </Menu>
        </Header>
    )
}