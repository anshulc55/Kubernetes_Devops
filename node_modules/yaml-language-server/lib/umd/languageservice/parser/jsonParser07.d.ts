import { JSONSchema, JSONSchemaRef } from '../jsonSchema';
import { ASTNode, ObjectASTNode, ArrayASTNode, BooleanASTNode, NumberASTNode, StringASTNode, NullASTNode, PropertyASTNode } from '../jsonASTTypes';
import { ErrorCode, JSONPath } from 'vscode-json-languageservice';
import { DiagnosticSeverity, Range } from 'vscode-languageserver-types';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver';
export interface IRange {
    offset: number;
    length: number;
}
export declare const YAML_SOURCE = "YAML";
export declare enum ProblemType {
    missingRequiredPropWarning = "missingRequiredPropWarning",
    typeMismatchWarning = "typeMismatchWarning",
    constWarning = "constWarning"
}
export interface IProblem {
    location: IRange;
    severity: DiagnosticSeverity;
    code?: ErrorCode;
    message: string;
    source?: string;
    problemType?: ProblemType;
    problemArgs?: string[];
    schemaUri?: string[];
}
export declare abstract class ASTNodeImpl {
    abstract readonly type: 'object' | 'property' | 'array' | 'number' | 'boolean' | 'null' | 'string';
    offset: number;
    length: number;
    readonly parent: ASTNode;
    location: string;
    constructor(parent: ASTNode, offset: number, length?: number);
    getNodeFromOffsetEndInclusive(offset: number): ASTNode;
    get children(): ASTNode[];
    toString(): string;
}
export declare class NullASTNodeImpl extends ASTNodeImpl implements NullASTNode {
    type: 'null';
    value: any;
    constructor(parent: ASTNode, offset: number, length?: number);
}
export declare class BooleanASTNodeImpl extends ASTNodeImpl implements BooleanASTNode {
    type: 'boolean';
    value: boolean;
    constructor(parent: ASTNode, boolValue: boolean, offset: number, length?: number);
}
export declare class ArrayASTNodeImpl extends ASTNodeImpl implements ArrayASTNode {
    type: 'array';
    items: ASTNode[];
    constructor(parent: ASTNode, offset: number, length?: number);
    get children(): ASTNode[];
}
export declare class NumberASTNodeImpl extends ASTNodeImpl implements NumberASTNode {
    type: 'number';
    isInteger: boolean;
    value: number;
    constructor(parent: ASTNode, offset: number, length?: number);
}
export declare class StringASTNodeImpl extends ASTNodeImpl implements StringASTNode {
    type: 'string';
    value: string;
    constructor(parent: ASTNode, offset: number, length?: number);
}
export declare class PropertyASTNodeImpl extends ASTNodeImpl implements PropertyASTNode {
    type: 'property';
    keyNode: StringASTNode;
    valueNode: ASTNode;
    colonOffset: number;
    constructor(parent: ObjectASTNode, offset: number, length?: number);
    get children(): ASTNode[];
}
export declare class ObjectASTNodeImpl extends ASTNodeImpl implements ObjectASTNode {
    type: 'object';
    properties: PropertyASTNode[];
    constructor(parent: ASTNode, offset: number, length?: number);
    get children(): ASTNode[];
}
export declare function asSchema(schema: JSONSchemaRef): JSONSchema;
export interface JSONDocumentConfig {
    collectComments?: boolean;
}
export interface IApplicableSchema {
    node: ASTNode;
    inverted?: boolean;
    schema: JSONSchema;
}
export declare enum EnumMatch {
    Key = 0,
    Enum = 1
}
export interface ISchemaCollector {
    schemas: IApplicableSchema[];
    add(schema: IApplicableSchema): void;
    merge(other: ISchemaCollector): void;
    include(node: ASTNode): boolean;
    newSub(): ISchemaCollector;
}
export declare class ValidationResult {
    problems: IProblem[];
    propertiesMatches: number;
    propertiesValueMatches: number;
    primaryValueMatches: number;
    enumValueMatch: boolean;
    enumValues: any[];
    constructor(isKubernetes: boolean);
    hasProblems(): boolean;
    mergeAll(validationResults: ValidationResult[]): void;
    merge(validationResult: ValidationResult): void;
    mergeEnumValues(validationResult: ValidationResult): void;
    /**
     * Merge multiple warnings with same problemType together
     * @param subValidationResult another possible result
     */
    mergeWarningGeneric(subValidationResult: ValidationResult, problemTypesToMerge: ProblemType[]): void;
    mergePropertyMatch(propertyValidationResult: ValidationResult): void;
    private mergeSources;
    compareGeneric(other: ValidationResult): number;
    compareKubernetes(other: ValidationResult): number;
}
export declare function newJSONDocument(root: ASTNode, diagnostics?: Diagnostic[]): JSONDocument;
export declare function getNodeValue(node: ASTNode): any;
export declare function getNodePath(node: ASTNode): JSONPath;
export declare function contains(node: ASTNode, offset: number, includeRightBound?: boolean): boolean;
export declare class JSONDocument {
    readonly root: ASTNode;
    readonly syntaxErrors: Diagnostic[];
    readonly comments: Range[];
    isKubernetes: boolean;
    disableAdditionalProperties: boolean;
    constructor(root: ASTNode, syntaxErrors?: Diagnostic[], comments?: Range[]);
    getNodeFromOffset(offset: number, includeRightBound?: boolean): ASTNode | undefined;
    getNodeFromOffsetEndInclusive(offset: number): ASTNode;
    visit(visitor: (node: ASTNode) => boolean): void;
    validate(textDocument: TextDocument, schema: JSONSchema): Diagnostic[];
    getMatchingSchemas(schema: JSONSchema, focusOffset?: number, exclude?: ASTNode): IApplicableSchema[];
}
