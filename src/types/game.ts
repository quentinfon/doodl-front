export interface IRoomConfig {
    gameMode: string;
    timeByTurn: number;
    maxPlayer: number;
  }

export interface IPlayer {
    playerId: string;
    name: string;
    imgUrl: string;
}
  
export interface IRoomStatus {
    isPlaying: boolean;
    playerList: IPlayer[];
    playerTurn: IPlayer[] | null;
}
  

export enum GameMode {
    CLASSIC = "CLASSIC"
}

export interface RoomConfig {
    minMaxPlayer: number;
    maxMaxPlayer: number;
    minTimeByTurn: number;
    maxTimeByTurn: number;
}

export interface RoomData {
    roomId: string,
    config?: IRoomConfig,
    status?: IRoomStatus
}

export interface Coordinate {
    x: number;
    y: number;
}

export enum DrawTool {
    BRUSH = "BRUSH",
    ERASER = "ERASER",
    FILL = "FILL"
}

export interface IDraw {
    tool: DrawTool;
    coords: Coordinate;
    color?: string;
    lineWidth?: number;
}