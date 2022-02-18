import {IDraw, IMessage, IPlayer, IRoomConfig, IRoomInfo, RoomState} from './GameModel';

export interface SocketUser {
    socket: WebSocket;
    readonly socketUUID: string;
    player?: IPlayer;
    roomId?: string;
}

export interface ISocketMessage {
    channel: GameSocketChannel;
}

export interface ISocketMessageRequest extends ISocketMessage {
    data?: IDataInitRequest | IDataChatRequest | IDraw | IRoomConfig;
}

export interface ISocketMessageResponse extends ISocketMessage {
    data: IDataInitResponse | IMessage | IDataDrawResponse | IDataInfoResponse | IRoomConfig | IDataInitAdminResponse;
}

export interface IDataInitRequest {
    roomId: string;
    name: string;
    imgUrl: string;
}

export interface IDataInitResponse {
    playerId: string;
    messages: IMessage[];
    draws: IDraw[];
}

export interface IDataInitAdminResponse {
    roomCount: number;
    wsCount: number;
    drawCount: number;
    roomList: IRoomInfo[];
}

export interface IDataChatRequest {
    message: string;
}

// IDataChatResponse is equals to IMessage

// IDataDrawRequest = IDraw
export interface IDataDrawResponse extends IDraw {
    draftsman: IPlayer;
}

// IDataInfoRequest is empty
export interface IDataInfoResponse {
    roomState: RoomState;
    playerList: IPlayer[];
    playerTurn: IPlayer[];
    roomConfig: IRoomConfig;
}

// IDataStartRequest = IRoomConfig
// IDataStartResponse = IRoomConfig on success

// IDataGuessRequest doesn't exist
export interface IDataGuessResponse {
    guessGainPoint: number;
    drawGainPoint: number;
    guesser: IPlayer;
}

export enum GameSocketChannel {
    PING = "PING",
    PONG = "PONG",
    INIT = "INIT",
    CHAT = "CHAT",
    CONFIG = "CONFIG",
    DRAW = "DRAW",
    INFO = "INFO",
    START = "START",
    GUESS = "GUESS"
}

export enum AdminSocketChannel {
    GLOBAL_DATA = "GLOBAL_DATA"
}