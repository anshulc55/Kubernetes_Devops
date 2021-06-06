import { CustomSchemaProvider, SchemaAdditions, SchemaDeletions, SchemaDeletionsAll } from './services/yamlSchemaService';
import { Position, CompletionList, Diagnostic, Hover, SymbolInformation, DocumentSymbol, TextEdit, DocumentLink, CodeLens } from 'vscode-languageserver-types';
import { JSONSchema } from './jsonSchema';
import { JSONDocument, DefinitionLink, TextDocument, DocumentSymbolsContext } from 'vscode-json-languageservice';
import { FoldingRange, ClientCapabilities, CodeActionParams, CodeAction, Connection, DocumentOnTypeFormattingParams, CodeLensParams } from 'vscode-languageserver/node';
import { FoldingRangesContext } from './yamlTypes';
import { Telemetry } from '../languageserver/telemetry';
export declare enum SchemaPriority {
    SchemaStore = 1,
    SchemaAssociation = 2,
    Settings = 3,
    Modeline = 4
}
export interface SchemasSettings {
    priority?: SchemaPriority;
    fileMatch: string[];
    schema?: unknown;
    uri: string;
}
export interface LanguageSettings {
    validate?: boolean;
    hover?: boolean;
    completion?: boolean;
    format?: boolean;
    isKubernetes?: boolean;
    schemas?: SchemasSettings[];
    customTags?: Array<string>;
    /**
     * Default indentation size
     */
    indentation?: string;
    /**
     * Globally set additionalProperties to false if additionalProperties is not set and if schema.type is object.
     * So if its true, no extra properties are allowed inside yaml.
     */
    disableAdditionalProperties?: boolean;
}
export interface WorkspaceContextService {
    resolveRelativePath(relativePath: string, resource: string): string;
}
/**
 * The schema request service is used to fetch schemas. The result should the schema file comment, or,
 * in case of an error, a displayable error string
 */
export interface SchemaRequestService {
    (uri: string): Promise<string>;
}
export interface SchemaConfiguration {
    /**
     * The URI of the schema, which is also the identifier of the schema.
     */
    uri: string;
    /**
     * A list of file names that are associated to the schema. The '*' wildcard can be used. For example '*.schema.json', 'package.json'
     */
    fileMatch?: string[];
    /**
     * The schema for the given URI.
     * If no schema is provided, the schema will be fetched with the schema request service (if available).
     */
    schema?: JSONSchema;
}
export interface CustomFormatterOptions {
    singleQuote?: boolean;
    bracketSpacing?: boolean;
    proseWrap?: string;
    printWidth?: number;
    enable?: boolean;
}
export interface LanguageService {
    configure(settings: LanguageSettings): void;
    registerCustomSchemaProvider(schemaProvider: CustomSchemaProvider): void;
    doComplete(document: TextDocument, position: Position, isKubernetes: boolean): Promise<CompletionList>;
    doValidation(document: TextDocument, isKubernetes: boolean): Promise<Diagnostic[]>;
    doHover(document: TextDocument, position: Position): Promise<Hover | null>;
    findDocumentSymbols(document: TextDocument, context: DocumentSymbolsContext): SymbolInformation[];
    findDocumentSymbols2(document: TextDocument, context: DocumentSymbolsContext): DocumentSymbol[];
    findDefinition(document: TextDocument, position: Position, doc: JSONDocument): Promise<DefinitionLink[]>;
    findLinks(document: TextDocument): Promise<DocumentLink[]>;
    resetSchema(uri: string): boolean;
    doFormat(document: TextDocument, options: CustomFormatterOptions): TextEdit[];
    doDocumentOnTypeFormatting(document: TextDocument, params: DocumentOnTypeFormattingParams): TextEdit[] | undefined;
    addSchema(schemaID: string, schema: JSONSchema): void;
    deleteSchema(schemaID: string): void;
    modifySchemaContent(schemaAdditions: SchemaAdditions): void;
    deleteSchemaContent(schemaDeletions: SchemaDeletions): void;
    deleteSchemasWhole(schemaDeletions: SchemaDeletionsAll): void;
    getFoldingRanges(document: TextDocument, context: FoldingRangesContext): FoldingRange[] | null;
    getCodeAction(document: TextDocument, params: CodeActionParams): CodeAction[] | undefined;
    getCodeLens(document: TextDocument, params: CodeLensParams): Thenable<CodeLens[] | undefined> | CodeLens[] | undefined;
    resolveCodeLens(param: CodeLens): Thenable<CodeLens> | CodeLens;
}
export declare function getLanguageService(schemaRequestService: SchemaRequestService, workspaceContext: WorkspaceContextService, connection: Connection, telemetry: Telemetry, clientCapabilities?: ClientCapabilities): LanguageService;
