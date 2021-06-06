import * as Yaml from 'yaml-language-server-parser';
import { ErrorCode } from 'vscode-json-languageservice/lib/umd/jsonLanguageTypes';
export declare const DUPLICATE_KEY_REASON = "duplicate key";
/**
 * An individual YAML diagnostic,
 * after formatting.
 */
export interface YAMLDocDiagnostic {
    message: string;
    location: {
        start: number;
        end: number;
        toLineEnd: boolean;
    };
    severity: 1 | 2;
    source?: string;
    code: ErrorCode;
}
/**
 * We have to convert the exceptions returned by the AST parser
 * into diagnostics for consumption by the server client.
 */
export declare function formatErrors(exceptions: Yaml.YAMLException[]): YAMLDocDiagnostic[];
export declare function isDuplicateAndNotMergeKey(error: Yaml.YAMLException, yamlText: string): boolean;
export declare function formatWarnings(exceptions: Yaml.YAMLException[], text: string): YAMLDocDiagnostic[];
export declare function customTagsToAdditionalOptions(customTags: string[]): Yaml.LoadOptions;
