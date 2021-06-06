"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const strings_1 = require("../src/languageservice/utils/strings");
const assert = require("assert");
describe('String Tests', () => {
    describe('startsWith', function () {
        it('String with different lengths', () => {
            const one = 'hello';
            const other = 'goodbye';
            const result = strings_1.startsWith(one, other);
            assert.equal(result, false);
        });
        it('String with same length different first letter', () => {
            const one = 'hello';
            const other = 'jello';
            const result = strings_1.startsWith(one, other);
            assert.equal(result, false);
        });
        it('Same string', () => {
            const one = 'hello';
            const other = 'hello';
            const result = strings_1.startsWith(one, other);
            assert.equal(result, true);
        });
    });
    describe('endsWith', function () {
        it('String with different lengths', () => {
            const one = 'hello';
            const other = 'goodbye';
            const result = strings_1.endsWith(one, other);
            assert.equal(result, false);
        });
        it('Strings that are the same', () => {
            const one = 'hello';
            const other = 'hello';
            const result = strings_1.endsWith(one, other);
            assert.equal(result, true);
        });
        it('Other is smaller then one', () => {
            const one = 'hello';
            const other = 'hi';
            const result = strings_1.endsWith(one, other);
            assert.equal(result, false);
        });
    });
    describe('convertSimple2RegExp', function () {
        it('Test of convertRegexString2RegExp', () => {
            const result = strings_1.convertSimple2RegExp('/toc\\.yml/i').test('TOC.yml');
            assert.equal(result, true);
        });
        it('Test of convertGlobalPattern2RegExp', () => {
            let result = strings_1.convertSimple2RegExp('toc.yml').test('toc.yml');
            assert.equal(result, true);
            result = strings_1.convertSimple2RegExp('toc.yml').test('TOC.yml');
            assert.equal(result, false);
        });
    });
});
//# sourceMappingURL=strings.test.js.map