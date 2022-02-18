import React, {useEffect, useState} from "react";
import {Accessoires, Eyebrows, Eyes, Mouth} from "@dicebear/adventurer-neutral/dist/options";
import {Button, Card, Col, Row, Typography} from "antd";
import {LeftOutlined, RightOutlined} from '@ant-design/icons';

const {Title} = Typography;

const getLocalStorageKey = (name: string): string => `avatar-${name}`;

const setLocalStorage = function <T>(name: string, item: T, list: T[]) {
    localStorage.setItem(getLocalStorageKey(name), "" + list.indexOf(item));
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


const getValueFromLocalStorage = function <T>(name: string, list: T[]): T {
    const item: any = localStorage.getItem(getLocalStorageKey(name));
    if (item && Number.isInteger(parseInt(item))) {
        const itemNumber = parseInt(item);
        if (itemNumber >= 0 && itemNumber < list.length) {
            return list[itemNumber];
        }
    }

    const itemNumber = getRandomInt(0, list.length - 1);
    const itemT = list[itemNumber];

    setLocalStorage(name, itemT, list);
    return itemT;
}

const getVariant = (n: number): string[] => {
    return Array(n).fill(0).map((val, id) => "variant" + ("" + (id + 1)).padStart(2, '0'))
}

const getNext = function <T>(current: T, list: T[]) {
    const nextIdx = (list.indexOf(current) + 1) % list.length;
    return list[nextIdx];
}
const getPrev = function <T>(current: T, list: T[]) {
    let prevIdx = (list.indexOf(current) - 1);
    if (prevIdx === -1) prevIdx = list.length - 1;
    return list[prevIdx];
}


interface AvatarPickerProps {
    setPlayerImg: (s: string) => any
}

const AvatarPicker = ({
                          setPlayerImg
                      }: AvatarPickerProps) => {

    const eyeList: Eyes[] = getVariant(26) as unknown as Eyes[];
    const eyeBrowsList: Eyebrows[] = getVariant(10) as unknown as Eyebrows[];
    const mouthList: Mouth[] = getVariant(30) as unknown as Mouth[];
    const accessoiresList: Accessoires[] = ["", "sunglasses", "glasses", "smallGlasses", "mustache", "blush", "birthmark"] as unknown as Accessoires[];

    const [eye, setEye] = useState<Eyes>(getValueFromLocalStorage('eye', eyeList));
    const [eyeBrows, setEyeBrows] = useState<Eyebrows>(getValueFromLocalStorage('eyeBrows', eyeBrowsList));
    const [mouth, setMouth] = useState<Mouth>(getValueFromLocalStorage('mouth', mouthList));
    const [accessoires, setAccessoires] = useState<Accessoires>(getValueFromLocalStorage('accessoires', accessoiresList));

    const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>(getAvatar());

    function getAvatar(): string {
        const urlParams: URLSearchParams = new URLSearchParams();
        urlParams.append("eyes", eye.toString());
        urlParams.append("eyebrows", eyeBrows.toString());
        urlParams.append("mouth", mouth.toString());
        if (accessoires.toString() !== '') {
            urlParams.append("accessoires", accessoires.toString());
            urlParams.append("accessoiresProbability", "100");
        }

        return `https://avatars.dicebear.com/api/adventurer-neutral/doodl.svg?${urlParams.toString()}`;
    }

    function updateLocalStorage() {
        setLocalStorage('eye', eye, eyeList);
        setLocalStorage('eyeBrows', eyeBrows, eyeBrowsList);
        setLocalStorage('mouth', mouth, mouthList);
        setLocalStorage('accessoires', accessoires, accessoiresList);
    }

    useEffect(() => {
        let newImg = getAvatar();
        setCurrentAvatarUrl(newImg);
        setPlayerImg(newImg);
        updateLocalStorage();
    }, [eye, eyeBrows, mouth, accessoires])

    const random = () => {
        setEye(eyeList[getRandomInt(0, eyeList.length - 1)]);
        setEyeBrows(eyeBrowsList[getRandomInt(0, eyeBrowsList.length - 1)]);
        setMouth(mouthList[getRandomInt(0, mouthList.length - 1)]);
        //30% de génération avec accessoires
        if (getRandomInt(0, 100) < 30) {
            setAccessoires(accessoiresList[getRandomInt(0, accessoiresList.length - 1)]);
        } else {
            setAccessoires(accessoiresList[0]);
        }
    }

    return (
        <Card>
            <Row
                justify="center"
                align="middle"
            >
                <Col lg={24} xl={12}>

                    <img src={currentAvatarUrl}/>

                </Col>

                <Col lg={24} xl={12}>
                    <Row justify={"center"}>
                        <Button
                            shape="circle"
                            icon={<LeftOutlined/>}
                            onClick={() => setEye(getPrev<Eyes>(eye, eyeList))}
                        />
                        <Title
                            level={3}
                            style={{marginLeft: "15px", marginRight: "15px"}}
                        >
                            Eyes
                        </Title>
                        <Button
                            shape="circle"
                            icon={<RightOutlined/>}
                            onClick={() => setEye(getPrev<Eyes>(eye, eyeList))}
                        />
                    </Row>
                    <Row justify={"center"}>
                        <Button
                            shape="circle"
                            icon={<LeftOutlined/>}
                            onClick={() => setEyeBrows(getPrev<Eyebrows>(eyeBrows, eyeBrowsList))}
                        />
                        <Title
                            style={{marginLeft: "15px", marginRight: "15px"}}
                            level={3}
                        >
                            Eye Brows
                        </Title>
                        <Button
                            shape="circle"
                            icon={<RightOutlined/>}
                            onClick={() => setEyeBrows(getNext<Eyebrows>(eyeBrows, eyeBrowsList))}
                        />
                    </Row>
                    <Row justify={"center"}>
                        <Button
                            shape="circle"
                            icon={<LeftOutlined/>}
                            onClick={() => setMouth(getPrev<Mouth>(mouth, mouthList))}
                        />
                        <Title
                            style={{marginLeft: "15px", marginRight: "15px"}}
                            level={3}
                        >
                            Mouth
                        </Title>
                        <Button
                            shape="circle"
                            icon={<RightOutlined/>}
                            onClick={() => setMouth(getNext<Mouth>(mouth, mouthList))}
                        />
                    </Row>
                    <Row justify={"center"}>
                        <Button
                            shape="circle"
                            icon={<LeftOutlined/>}
                            onClick={() => setAccessoires(getPrev<Accessoires>(accessoires, accessoiresList))}
                        />
                        <Title
                            level={3}
                            style={{marginLeft: "15px", marginRight: "15px"}}
                        >
                            Accessoires
                        </Title>
                        <Button
                            shape="circle"
                            icon={<RightOutlined/>}
                            onClick={() => setAccessoires(getNext<Accessoires>(accessoires, accessoiresList))}
                        />
                    </Row>
                    <Row justify={"center"}>
                        <Button
                            onClick={random}
                            style={{marginTop: "20px"}}
                            type="dashed"
                            size="large"
                        >
                            Random
                        </Button>
                    </Row>
                </Col>
            </Row>

        </Card>
    );
}

export default AvatarPicker;