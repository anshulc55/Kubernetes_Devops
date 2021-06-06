"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customTagsToAdditionalOptions = exports.formatWarnings = exports.isDuplicateAndNotMergeKey = exports.formatErrors = exports.DUPLICATE_KEY_REASON = void 0;
const schema_1 = require("yaml-language-server-parser/dist/src/schema");
const type_1 = require("yaml-language-server-parser/dist/src/type");
const arrUtils_1 = require("./arrUtils");
const jsonLanguageTypes_1 = require("vscode-json-languageservice/lib/umd/jsonLanguageTypes");
exports.DUPLICATE_KEY_REASON = 'duplicate key';
/**
 * Convert a YAML node exception to a
 * special diagnostic type (NOT YET THE
 * LANGUAGE SERVER DIAGNOSTIC).
 */
function exceptionToDiagnostic(e) {
    return {
        message: `${e.reason}`,
        location: {
            start: e.mark.position,
            end: e.mark.position + 1,
            toLineEnd: e.mark.toLineEnd,
        },
        severity: 2,
        code: jsonLanguageTypes_1.ErrorCode.Undefined,
    };
}
/**
 * We have to convert the exceptions returned by the AST parser
 * into diagnostics for consumption by the server client.
 */
function formatErrors(exceptions) {
    return exceptions.filter((e) => e.reason !== exports.DUPLICATE_KEY_REASON && !e.isWarning).map((e) => exceptionToDiagnostic(e));
}
exports.formatErrors = formatErrors;
//Patch ontop of yaml-ast-parser to disable duplicate key message on merge key
function isDuplicateAndNotMergeKey(error, yamlText) {
    const errorStart = error.mark.position;
    const errorEnd = error.mark.position + error.mark.column;
    if (error.reason === exports.DUPLICATE_KEY_REASON && yamlText.substring(errorStart, errorEnd).startsWith('<<')) {
        return false;
    }
    return true;
}
exports.isDuplicateAndNotMergeKey = isDuplicateAndNotMergeKey;
function formatWarnings(exceptions, text) {
    return exceptions
        .filter((e) => (e.reason === exports.DUPLICATE_KEY_REASON && isDuplicateAndNotMergeKey(e, text)) || e.isWarning)
        .map((e) => exceptionToDiagnostic(e));
}
exports.formatWarnings = formatWarnings;
function customTagsToAdditionalOptions(customTags) {
    const filteredTags = arrUtils_1.filterInvalidCustomTags(customTags);
    const schemaWithAdditionalTags = schema_1.Schema.create(filteredTags.map((tag) => {
        const typeInfo = tag.split(' ');
        return new type_1.Type(typeInfo[0], {
            kind: (typeInfo[1] && typeInfo[1].toLowerCase()) || 'scalar',
        });
    }));
    /**
     * Collect the additional tags into a map of string to possible tag types
     */
    const tagWithAdditionalItems = new Map();
    filteredTags.forEach((tag) => {
        const typeInfo = tag.split(' ');
        const tagName = typeInfo[0];
        const tagType = (typeInfo[1] && typeInfo[1].toLowerCase()) || 'scalar';
        if (tagWithAdditionalItems.has(tagName)) {
            tagWithAdditionalItems.set(tagName, tagWithAdditionalItems.get(tagName).concat([tagType]));
        }
        else {
            tagWithAdditionalItems.set(tagName, [tagType]);
        }
    });
    tagWithAdditionalItems.forEach((additionalTagKinds, key) => {
        const newTagType = new type_1.Type(key, { kind: additionalTagKinds[0] || 'scalar' });
        newTagType.additionalKinds = additionalTagKinds;
        schemaWithAdditionalTags.compiledTypeMap[key] = newTagType;
    });
    const additionalOptions = {
        schema: schemaWithAdditionalTags,
    };
    return additionalOptions;
}
exports.customTagsToAdditionalOptions = customTagsToAdditionalOptions;
//# sourceMappingURL=parseUtils.js.map