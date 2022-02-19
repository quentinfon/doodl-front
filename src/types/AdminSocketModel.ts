import {IMessage, IPlayer, IRoomConfig} from "./GameModel";
import {IDataDrawResponse, IDataInfoResponse, IDataInitResponse, ISocketMessage} from "./SocketModel";

export interface IAdminSocketMessage {
    channel: AdminSocketChannel;
}

export interface IAdminSocketMessageRequest extends IAdminSocketMessage {
    data: IAdminSocketDeletePlayerRequest | IAdminSocketConnectResponse;
}


export interface IAdminSocketConnectResponse extends IAdminSocketMessage {
    data: {
        roomCount: number;
        wsCount: number;
        drawCount: number;
        roomList: IAdminRoomInfo[];
    };
}

export interface IAdminRoomInfo {
    roomId: string;
    playerList: IPlayer[];
    drawCount: number;
}

export interface IAdminSocketDeletePlayerRequest {
    playerId: string;
    roomId: string;
}

export enum AdminSocketChannel {
    GLOBAL_DATA = "GLOBAL_DATA",
    KICK_PLAYER = "KICK_PLAYER"
}