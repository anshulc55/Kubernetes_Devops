/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSimple2RegExpPattern = exports.convertSimple2RegExp = exports.endsWith = exports.startsWith = void 0;
function startsWith(haystack, needle) {
    if (haystack.length < needle.length) {
        return false;
    }
    for (let i = 0; i < needle.length; i++) {
        if (haystack[i] !== needle[i]) {
            return false;
        }
    }
    return true;
}
exports.startsWith = startsWith;
/**
 * Determines if haystack ends with needle.
 */
function endsWith(haystack, needle) {
    const diff = haystack.length - needle.length;
    if (diff > 0) {
        return haystack.lastIndexOf(needle) === diff;
    }
    else if (diff === 0) {
        return haystack === needle;
    }
    else {
        return false;
    }
}
exports.endsWith = endsWith;
function convertSimple2RegExp(pattern) {
    const match = pattern.match(new RegExp('^/(.*?)/([gimy]*)$'));
    return match ? convertRegexString2RegExp(match[1], match[2]) : convertGlobalPattern2RegExp(pattern);
}
exports.convertSimple2RegExp = convertSimple2RegExp;
function convertGlobalPattern2RegExp(pattern) {
    return new RegExp(pattern.replace(/[-\\{}+?|^$.,[\]()#\s]/g, '\\$&').replace(/[*]/g, '.*') + '$');
}
function convertRegexString2RegExp(pattern, flag) {
    return new RegExp(pattern, flag);
}
function convertSimple2RegExpPattern(pattern) {
    return pattern.replace(/[-\\{}+?|^$.,[\]()#\s]/g, '\\$&').replace(/[*]/g, '.*');
}
exports.convertSimple2RegExpPattern = convertSimple2RegExpPattern;
//# sourceMappingURL=strings.js.map