import { IRoomConfig } from '../types/game';
import { fetchURL, HttpMethod } from './request';

const service_endpoint = process.env.REACT_APP_API_ENDPOINT;

export const getRoomCreationConfig = () => {
    return fetchURL(`${service_endpoint}/config`, HttpMethod.GET);
}

export const createNewRoom = (roomData: IRoomConfig) => {
    const headers: Headers = new Headers({
        'Content-Type': 'application/json'
    });
    return fetchURL(`${service_endpoint}/room`, HttpMethod.POST, headers, roomData);
}