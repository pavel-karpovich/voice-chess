export declare const chessBoardSize = 8;
export declare enum ChessGameState {
    OK = 0,
    CHECK = 1,
    CHECKMATE = 2
}
/**
 * Class for making move in chess
 */
export declare class Chess {
    private stockfish;
    private fen;
    private moves;
    private checkers;
    private onChangeGameState;
    private enemy;
    private depth;
    /**
     * Chess game with initial board state
     * @param {string} fenstring
     * @param {number} difficulty
     * Callback is needed only when creating new game without fenstring
     */
    constructor(fenstring: string, difficulty: number);
    /**
     * Set given level of difficulty in the Stockfish Engine
     * @param {number} level
     */
    private configureDifficulty;
    /**
     * The const fen string value of te start chess position
     */
    static readonly initialFen: string;
    /**
     * Get legal moves for current board position
     */
    updateGameState(): Promise<void>;
    /**
     * Checks if this move is allowed
     * @param {string} move
     */
    isMoveLegal(move: string): Promise<boolean>;
    /**
     * Player move
     * @param {string} move
     */
    move(move: string): Promise<void>;
    /**
     * Move making by computer
     */
    moveAuto(): Promise<void>;
    readonly currentGameState: ChessGameState;
    /**
     * Get fen string - chess board state representation in string
     */
    readonly fenstring: string;
    /**
     * Get last enemy's move
     */
    readonly enemyMove: string;
}
