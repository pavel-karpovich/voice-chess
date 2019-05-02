export declare class Ask {
    private static lang;
    static setLanguage(language?: string): void;
    static askToNewGame(): string;
    static askToContinue(): string;
    static ingameTips(): string;
    static nogameTips(): string;
    static askToRemindBoard(): string;
    static askToGoNext(): string;
    static chooseSide(): string;
    static whatToDo(): string;
    static askWhatever(): string;
    static askToMove(): string;
    static askToMoveAgain(): string;
    static nowYouNeedToMove(): string;
    static waitMove(): string;
    static silence(): string;
    static askRowNumber(): string;
    static askToChangeDifficulty(): string;
    static difficultyWithoutValue(): string;
}
