export interface ISocketMessage {
    channel: SocketChannel;
}

export interface ISocketMessageRequest extends ISocketMessage {
    data: IDataInitRequest | IDataChatRequest;
}

export interface ISocketMessageResponse extends ISocketMessage {
    data: IDataInitResponse | IDataChatResponse;
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