import { JSONDocument } from './jsonParser07';
import { YAMLDocDiagnostic } from '../utils/parseUtils';
import { ASTNode } from '../jsonASTTypes';
/**
 * These documents are collected into a final YAMLDocument
 * and passed to the `parseYAML` caller.
 */
export declare class SingleYAMLDocument extends JSONDocument {
    private lines;
    root: ASTNode;
    errors: YAMLDocDiagnostic[];
    warnings: YAMLDocDiagnostic[];
    isKubernetes: boolean;
    currentDocIndex: number;
    lineComments: string[];
    constructor(lines: number[]);
    getSchemas(schema: any, doc: any, node: any): any[];
}
/**
 * Contains the SingleYAMLDocuments, to be passed
 * to the `parseYAML` caller.
 */
export declare class YAMLDocument {
    documents: SingleYAMLDocument[];
    private errors;
    private warnings;
    constructor(documents: SingleYAMLDocument[]);
}
/**
 * `yaml-ast-parser-custom-tags` parses the AST and
 * returns YAML AST nodes, which are then formatted
 * for consumption via the language server.
 */
export declare function parse(text: string, customTags?: any[]): YAMLDocument;
