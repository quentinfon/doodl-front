import {Button, Result} from "antd";
import React from "react";
import {useNavigate} from "react-router-dom";

const RoomUnavailable = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="warning"
            title="The room you are asking for doesn't exist."
            extra={
                <Button key="console" onClick={() => navigate('/')}>
                    Home page
                </Button>
            }
        />
    )
}

export default RoomUnavailable;