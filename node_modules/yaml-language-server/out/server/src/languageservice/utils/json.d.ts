export interface StringifySettings {
    newLineFirst: boolean;
    indentFirstObject: boolean;
    shouldIndentWithTab: boolean;
}
export declare function stringifyObject(obj: unknown, indent: string, stringifyLiteral: (val: unknown) => string, settings: StringifySettings, depth?: number, consecutiveArrays?: number): string;
