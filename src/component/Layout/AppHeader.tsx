import {Button, Menu, message} from "antd";
import React from "react";
import {Header} from "antd/lib/layout/layout";

import './AppHeader.css';
import logoUrl from '/logo.png'
import {Link} from "react-router-dom";

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
                    <img className="logo" src={logoUrl} alt="logo"/>
                </Link>
            </div>

            <Menu theme="dark" mode="horizontal">
                <Menu.Item key="home">
                        <Link to="/">
                            <span className="nav-text">Home</span>
                        </Link>
                </Menu.Item>
                <Space direction="vertical">
                    <Button type="primary" onClick={copyPageLink} >
                        Share the link
                    </Button>
                </Space>
            </Menu>
        </Header>
    )
}