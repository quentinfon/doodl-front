import {Button, Menu, message, Space} from "antd";
import React from "react";
import {Header} from "antd/lib/layout/layout";
import {
 LinkOutlined
} from '@ant-design/icons';

import './AppHeader.css';
import logoUrl from '/logo.png'
import {Link} from "react-router-dom";

const copyPageLink = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        copied();
    } catch (err) {
        notCopied();
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

                <Space style={{marginLeft: "auto", marginRight: "8px", marginBottom: "-8px"}}>
                    <LinkOutlined onClick={copyPageLink} style={{ fontSize: "200%"}}></LinkOutlined>
                </Space>
            </Menu>
        </Header>
    )
}