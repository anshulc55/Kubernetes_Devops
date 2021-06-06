import { YAMLSchemaService } from './yamlSchemaService';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { CompletionList, Position } from 'vscode-languageserver-types';
import { LanguageSettings } from '../yamlLanguageService';
import { JSONCompletion } from 'vscode-json-languageservice/lib/umd/services/jsonCompletion';
import { ClientCapabilities } from 'vscode-languageserver';
import { Telemetry } from '../../languageserver/telemetry';
export declare class YAMLCompletion extends JSONCompletion {
    private readonly telemetry;
    private schemaService;
    private customTags;
    private completion;
    private indentation;
    private configuredIndentation;
    constructor(schemaService: YAMLSchemaService, clientCapabilities: ClientCapabilities, telemetry: Telemetry);
    configure(languageSettings: LanguageSettings, customTags: Array<string>): void;
    doComplete(document: TextDocument, position: Position, isKubernetes?: boolean): Promise<CompletionList>;
    private getPropertyCompletions;
    private getValueCompletions;
    private getCustomTagValueCompletions;
    private addSchemaValueCompletions;
    private addDefaultValueCompletions;
    private collectDefaultSnippets;
    private getInsertTextForSnippetValue;
    private getLabelForSnippetValue;
    private addCustomTagValueCompletion;
    private addBooleanValueCompletion;
    private getSuggestionKind;
    private addNullValueCompletion;
    private getInsertTextForValue;
    private getInsertTemplateForValue;
    private getInsertTextForPlainText;
    private getInsertTextForObject;
    private getInsertTextForArray;
    private getInsertTextForProperty;
    private getInsertTextForGuessedValue;
    private getLabelForValue;
    /**
     * Corrects simple syntax mistakes to load possible nodes even if a semicolon is missing
     */
    private completionHelper;
    private is_EOL;
    private getDocumentationWithMarkdownText;
}
