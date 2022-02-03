import { Button, Result } from "antd";
import React from "react";

const RoomUnvailable = () => {

    return (

        <Result
            status="warning"
            title="The room you are asking for doesn't exist."
            extra={
            <Button key="console">
                Home page
            </Button>
            }
        />

    )
}

export default RoomUnvailable;