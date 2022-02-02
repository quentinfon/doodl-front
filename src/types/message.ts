export interface SocketMessage {
    channel: string;
    data: string | DrawData;
}

export interface DrawData {
    
}

export interface GameMessage {
    message: string;
    author: string;
    authorImg: string;
}