import { SettingsState } from '../../src/yamlSettings';
import { LanguageService, LanguageSettings } from '../../src';
import { ValidationHandler } from '../../src/languageserver/handlers/validationHandlers';
import { LanguageHandlers } from '../../src/languageserver/handlers/languageHandlers';
import { TextDocument } from 'vscode-languageserver-textdocument';
export declare function toFsPath(str: unknown): string;
export declare const TEST_URI = "file://~/Desktop/vscode-k8s/test.yaml";
export declare const SCHEMA_ID = "default_schema_id.yaml";
export declare function setupTextDocument(content: string): TextDocument;
export declare function setupSchemaIDTextDocument(content: string, customSchemaID?: string): TextDocument;
export interface TestLanguageServerSetup {
    languageService: LanguageService;
    validationHandler: ValidationHandler;
    languageHandler: LanguageHandlers;
    yamlSettings: SettingsState;
}
export declare function setupLanguageService(languageSettings: LanguageSettings): TestLanguageServerSetup;
