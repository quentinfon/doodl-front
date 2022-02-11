import { IDraw } from "./game";

export interface ISocketMessage {
    channel: SocketChannel;
}

export interface ISocketMessageRequest extends ISocketMessage {
    data: IDataInitRequest | IDataChatRequest | IDraw;
}

export interface ISocketMessageResponse extends ISocketMessage {
    data: IDataInitResponse | IDataChatResponse | IDraw;
}

export interface IDataInitRequest {
    roomId: string;
    name: string;
    imgUrl: string;
}

export interface IDataInitResponse {
    playerId: string;
}

export interface IDataChatRequest {
    message: string;
}

export interface IMessageAuthor {
    name: string;
    imgUrl: string;
}

export interface IDataChatResponse {
    author: IMessageAuthor;
    message: string;
    timestamp: Date;
}

export enum SocketChannel {
    INIT = "INIT",
    CHAT = "CHAT",
    DRAW = "DRAW"
}
