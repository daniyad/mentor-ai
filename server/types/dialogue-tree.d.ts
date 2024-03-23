export class DialogueTree {
    constructor();

    getOptionsForUserInput(userInput: string): string[];
    getResponseForUserInput(userInput: string): string | null;
}
