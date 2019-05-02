export interface ChessboardCell {
    pos: string;
    val: string;
}
/**
 * Class for making move in chess
 */
export declare class Chess {
    private stockfish;
    private fen;
    private onMove;
    private onLegalMoves;
    private enemyMoveValue;
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
    getLegalMoves(): Promise<string[]>;
    /**
     * Checks if this move is allowed
     * @param {string} move
     */
    isMoveLegal(move: string): Promise<boolean>;
    /**
     * Player move
     * @param {string} move
     */
    move(move: string): Promise<{}>;
    /**
     * Move making by computer
     */
    moveAuto(): Promise<{}>;
    /**
     * Get fen string - chess board state representation in string
     */
    readonly fenstring: string;
    /**
     * Get last enemy's move
     */
    readonly enemyMove: string;
    /**
     * Parse fen string into 2-dim array
     * @param {string} fen fen string
     * @return {ChessboardCell[][]} 2-dim array with board data
     */
    static parseBoard(fen: string): ChessboardCell[][];
}
