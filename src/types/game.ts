export interface GameConfig {
    gameMode: string;
    timeByTurn: number;
    maxPlayer: number;
}

export enum GameMode {
    CLASSIC = "CLASSIC"
}