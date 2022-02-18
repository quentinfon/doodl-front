import React, { useState } from "react";
import { createAvatar } from "@dicebear/avatars";
import * as style from '@dicebear/adventurer-neutral';
import { Accessoires, Eyebrows, Eyes, Mouth } from "@dicebear/adventurer-neutral/dist/options";
import { useEffect } from "react";

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


interface AvatarPickerProps {
    setPlayerImg: (s: string) => any
}

const AvatarPicker = ({
    setPlayerImg
}: AvatarPickerProps) => {

    const eyeList: Eyes[] = getVariant(26) as unknown as Eyes[];
    const eyeBrowsList: Eyebrows[] = getVariant(10) as unknown as Eyebrows[];
    const mouthList: Mouth[] = getVariant(30) as unknown as Mouth[];
    const accessoiresList: Accessoires[] = ["sunglasses", "glasses", "smallGlasses", "mustache", "blush", "birthmark"] as unknown as Accessoires[];

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
        urlParams.append("accessoires", accessoires.toString());

        return `https://avatars.dicebear.com/api/adventurer-neutral/doodl.svg?${urlParams.toString()}`;
    }

    function updateLocalStorage() {
        setLocalStorage('eye', eye, eyeList);
        setLocalStorage('eyeBrows', eyeBrows, eyeBrowsList);
        setLocalStorage('mouth', mouth, mouthList);
        setLocalStorage('accessoires', accessoires, accessoiresList);
    }

    useEffect(() => {
        setPlayerImg(getAvatar());
        updateLocalStorage();
    }, [eye, eyeBrows, mouth, accessoires])

    return (
        <>

            <img src={currentAvatarUrl} />

        </>
    );
}

export default AvatarPicker;