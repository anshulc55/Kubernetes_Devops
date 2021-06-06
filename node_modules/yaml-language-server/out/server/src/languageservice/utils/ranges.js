"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIntersect = void 0;
/**
 * Check if rangeA and rangeB is intersect
 * @param rangeA
 * @param rangeB
 */
function isIntersect(rangeA, rangeB) {
    if (rangeA.start.line >= rangeB.start.line &&
        rangeA.start.character >= rangeB.start.character &&
        rangeA.start.line <= rangeB.end.line &&
        rangeA.start.character <= rangeB.end.character) {
        return true;
    }
    if (rangeA.end.line >= rangeB.start.line &&
        rangeA.end.character >= rangeB.start.character &&
        rangeA.end.line <= rangeB.end.line &&
        rangeA.end.character <= rangeB.end.character) {
        return true;
    }
    if (rangeA.start.line >= rangeB.start.line &&
        rangeA.start.character >= rangeB.start.character &&
        rangeA.end.line <= rangeB.end.line &&
        rangeA.end.character <= rangeB.end.character) {
        return true;
    }
    return false;
}
exports.isIntersect = isIntersect;
//# sourceMappingURL=ranges.js.map