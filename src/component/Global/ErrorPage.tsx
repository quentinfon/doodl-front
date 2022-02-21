import React from "react";
import {Button, Result} from "antd";
import {useNavigate} from "react-router-dom";

interface ErrorPageProps {
    errorMsg: any
}


const ErrorPage = ({
                       errorMsg
                   }: ErrorPageProps) => {

    const navigate = useNavigate();

    return (
        <>
            <Result
                status="error"
                title="An error occured"
                subTitle={errorMsg}
                extra={[
                    <Button key="console" onClick={() => navigate('/')}>
                        Home page
                    </Button>
                ]}
            />
        </>
    )
}

export default ErrorPage;