"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const chai_1 = require("chai");
const vscode_languageserver_1 = require("vscode-languageserver");
const yamlOnTypeFormatting_1 = require("../src/languageservice/services/yamlOnTypeFormatting");
const testHelper_1 = require("./utils/testHelper");
function createParams(position) {
    return {
        textDocument: testHelper_1.setupTextDocument(''),
        ch: '\n',
        options: vscode_languageserver_1.FormattingOptions.create(2, true),
        position,
    };
}
describe('YAML On Type Formatter', () => {
    it('should react on "\n" only', () => {
        const doc = testHelper_1.setupTextDocument('foo:');
        const params = createParams(vscode_languageserver_1.Position.create(1, 0));
        params.ch = '\t';
        const result = yamlOnTypeFormatting_1.doDocumentOnTypeFormatting(doc, params);
        chai_1.expect(result).is.undefined;
    });
    it('should add indentation for mapping', () => {
        const doc = testHelper_1.setupTextDocument('foo:\n');
        const params = createParams(vscode_languageserver_1.Position.create(1, 0));
        const result = yamlOnTypeFormatting_1.doDocumentOnTypeFormatting(doc, params);
        chai_1.expect(result).to.deep.include(vscode_languageserver_1.TextEdit.insert(vscode_languageserver_1.Position.create(1, 0), '  '));
    });
    it('should add indentation for scalar array items', () => {
        const doc = testHelper_1.setupTextDocument('foo:\n  - some\n  ');
        const pos = vscode_languageserver_1.Position.create(2, 2);
        const params = createParams(pos);
        const result = yamlOnTypeFormatting_1.doDocumentOnTypeFormatting(doc, params);
        chai_1.expect(result[0]).to.eqls(vscode_languageserver_1.TextEdit.insert(pos, '- '));
    });
    it('should add indentation for mapping in array', () => {
        const doc = testHelper_1.setupTextDocument('some:\n  - arr:\n  ');
        const pos = vscode_languageserver_1.Position.create(2, 2);
        const params = createParams(pos);
        const result = yamlOnTypeFormatting_1.doDocumentOnTypeFormatting(doc, params);
        chai_1.expect(result).to.deep.include(vscode_languageserver_1.TextEdit.insert(pos, '    '));
    });
    it('should replace all spaces in newline', () => {
        const doc = testHelper_1.setupTextDocument('some:\n    ');
        const pos = vscode_languageserver_1.Position.create(1, 0);
        const params = createParams(pos);
        const result = yamlOnTypeFormatting_1.doDocumentOnTypeFormatting(doc, params);
        chai_1.expect(result).to.deep.include.members([vscode_languageserver_1.TextEdit.del(vscode_languageserver_1.Range.create(pos, vscode_languageserver_1.Position.create(1, 3))), vscode_languageserver_1.TextEdit.insert(pos, '  ')]);
    });
    it('should keep all non white spaces characters in newline', () => {
        const doc = testHelper_1.setupTextDocument('some:\n  foo');
        const pos = vscode_languageserver_1.Position.create(1, 0);
        const params = createParams(pos);
        const result = yamlOnTypeFormatting_1.doDocumentOnTypeFormatting(doc, params);
        chai_1.expect(result).is.undefined;
    });
    it('should add indentation for multiline string', () => {
        const doc = testHelper_1.setupTextDocument('some: |\n');
        const pos = vscode_languageserver_1.Position.create(1, 0);
        const params = createParams(pos);
        const result = yamlOnTypeFormatting_1.doDocumentOnTypeFormatting(doc, params);
        chai_1.expect(result).to.deep.include(vscode_languageserver_1.TextEdit.insert(pos, '  '));
    });
});
//# sourceMappingURL=yamlOnTypeFormatting.test.js.map