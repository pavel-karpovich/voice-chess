export interface ChessCellInfo {
    pos: string;
    val: string;
}
export declare class ChessBoard {
    private board;
    constructor(fen: string);
    row(i: number): ChessCellInfo[];
    pos(pos: string): string;
}
