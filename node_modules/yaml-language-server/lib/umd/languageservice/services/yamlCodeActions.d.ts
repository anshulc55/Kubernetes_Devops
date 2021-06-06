import { TextDocument } from 'vscode-languageserver-textdocument';
import { ClientCapabilities, CodeAction, CodeActionParams } from 'vscode-languageserver';
import { LanguageSettings } from '../yamlLanguageService';
export declare class YamlCodeActions {
    private readonly clientCapabilities;
    private indentation;
    constructor(clientCapabilities: ClientCapabilities);
    configure(settings: LanguageSettings): void;
    getCodeAction(document: TextDocument, params: CodeActionParams): CodeAction[] | undefined;
    private getJumpToSchemaActions;
    private getTabToSpaceConverting;
}
