import React from "react";
import {Col, message, Row, Typography} from "antd";

interface LobbyInfoProps {
    roomId: string
}

const LobbyInfo = ({
                       roomId
                   }: LobbyInfoProps) => {

    const {Title, Text} = Typography;

    const copied = () => {
        message.success('Room Id has succesfully been copied');
    }

    const notCopied = () => {
        message.error('Error while copying Room Id')
    };

    return (
        <>
            <Row
                justify={"center"}
                style={{
                    padding: "32px"
                }}
            >
                <Col>
                    <Title level={3}>
                        Room Id:
                        <Text
                            keyboard
                            style={{
                                cursor: "pointer",
                                marginLeft: "8px"
                            }}
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(roomId);
                                    copied();
                                } catch (err) {
                                    notCopied();
                                }
                            }}
                        >
                            {roomId}
                        </Text>
                    </Title>
                </Col>
            </Row>
        </>
    )
}

export default LobbyInfo;