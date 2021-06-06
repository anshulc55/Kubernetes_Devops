import { TextDocument } from 'vscode-languageserver-textdocument';
import { YAMLDocument } from './yamlParser07';
export declare class YamlDocuments {
    private cache;
    /**
     * Get cached YAMLDocument
     * @param document TextDocument to parse
     * @param customTags YAML custom tags
     * @param addRootObject if true and document is empty add empty object {} to force schema usage
     * @returns the YAMLDocument
     */
    getYamlDocument(document: TextDocument, customTags?: string[], addRootObject?: boolean): YAMLDocument;
    /**
     * For test purpose only!
     */
    clear(): void;
    private ensureCache;
}
export declare const yamlDocumentsCache: YamlDocuments;
