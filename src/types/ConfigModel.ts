export interface IRoomServerConfig {
    minPlayerPerRoom: number;
    maxPlayerPerRoom: number;
    minTimeByTurn: number;
    maxTimeByTurn: number;
    minCycleRoundByGame: number;
    maxCycleRoundByGame: number;

    maxChatMessageLength: number;
    minPointGuess: number;
    maxPointGuess: number;
}