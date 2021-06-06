import { TextDocument } from 'vscode-json-languageservice';
import { Range } from 'vscode-languageserver-types';
export declare class TextBuffer {
    private doc;
    constructor(doc: TextDocument);
    getLineCount(): number;
    getLineLength(lineNumber: number): number;
    getLineContent(lineNumber: number): string;
    getLineCharCode(lineNumber: number, index: number): number;
    getText(range?: Range): string;
}
