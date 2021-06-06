"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.YamlCodeActions = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const commands_1 = require("../../commands");
const path = require("path");
const textBuffer_1 = require("../utils/textBuffer");
class YamlCodeActions {
    constructor(clientCapabilities) {
        this.clientCapabilities = clientCapabilities;
        this.indentation = '  ';
    }
    configure(settings) {
        this.indentation = settings.indentation;
    }
    getCodeAction(document, params) {
        if (!params.context.diagnostics) {
            return;
        }
        const result = [];
        result.push(...this.getJumpToSchemaActions(params.context.diagnostics));
        result.push(...this.getTabToSpaceConverting(params.context.diagnostics, document));
        return result;
    }
    getJumpToSchemaActions(diagnostics) {
        var _a, _b, _c, _d, _e;
        const isOpenTextDocumentEnabled = (_d = (_c = (_b = (_a = this.clientCapabilities) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.showDocument) === null || _c === void 0 ? void 0 : _c.support) !== null && _d !== void 0 ? _d : false;
        if (!isOpenTextDocumentEnabled) {
            return [];
        }
        const schemaUriToDiagnostic = new Map();
        for (const diagnostic of diagnostics) {
            const schemaUri = ((_e = diagnostic.data) === null || _e === void 0 ? void 0 : _e.schemaUri) || [];
            for (const schemaUriStr of schemaUri) {
                if (schemaUriStr) {
                    if (!schemaUriToDiagnostic.has(schemaUriStr)) {
                        schemaUriToDiagnostic.set(schemaUriStr, []);
                    }
                    schemaUriToDiagnostic.get(schemaUriStr).push(diagnostic);
                }
            }
        }
        const result = [];
        for (const schemaUri of schemaUriToDiagnostic.keys()) {
            const action = vscode_languageserver_1.CodeAction.create(`Jump to schema location (${path.basename(schemaUri)})`, vscode_languageserver_1.Command.create('JumpToSchema', commands_1.YamlCommands.JUMP_TO_SCHEMA, schemaUri));
            action.diagnostics = schemaUriToDiagnostic.get(schemaUri);
            result.push(action);
        }
        return result;
    }
    getTabToSpaceConverting(diagnostics, document) {
        const result = [];
        const textBuff = new textBuffer_1.TextBuffer(document);
        const processedLine = [];
        for (const diag of diagnostics) {
            if (diag.message === 'Using tabs can lead to unpredictable results') {
                if (processedLine.includes(diag.range.start.line)) {
                    continue;
                }
                const lineContent = textBuff.getLineContent(diag.range.start.line);
                let replacedTabs = 0;
                let newText = '';
                for (let i = diag.range.start.character; i <= diag.range.end.character; i++) {
                    const char = lineContent.charAt(i);
                    if (char !== '\t') {
                        break;
                    }
                    replacedTabs++;
                    newText += this.indentation;
                }
                processedLine.push(diag.range.start.line);
                let resultRange = diag.range;
                if (replacedTabs !== diag.range.end.character - diag.range.start.character) {
                    resultRange = vscode_languageserver_1.Range.create(diag.range.start, vscode_languageserver_1.Position.create(diag.range.end.line, diag.range.start.character + replacedTabs));
                }
                result.push(vscode_languageserver_1.CodeAction.create('Convert Tab to Spaces', createWorkspaceEdit(document.uri, [vscode_languageserver_1.TextEdit.replace(resultRange, newText)]), vscode_languageserver_1.CodeActionKind.QuickFix));
            }
        }
        if (result.length !== 0) {
            const replaceEdits = [];
            for (let i = 0; i <= textBuff.getLineCount(); i++) {
                const lineContent = textBuff.getLineContent(i);
                let replacedTabs = 0;
                let newText = '';
                for (let j = 0; j < lineContent.length; j++) {
                    const char = lineContent.charAt(j);
                    if (char !== ' ' && char !== '\t') {
                        if (replacedTabs !== 0) {
                            replaceEdits.push(vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(i, j - replacedTabs, i, j), newText));
                            replacedTabs = 0;
                            newText = '';
                        }
                        break;
                    }
                    if (char === ' ' && replacedTabs !== 0) {
                        replaceEdits.push(vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(i, j - replacedTabs, i, j), newText));
                        replacedTabs = 0;
                        newText = '';
                        continue;
                    }
                    if (char === '\t') {
                        newText += this.indentation;
                        replacedTabs++;
                    }
                }
                // line contains only tabs
                if (replacedTabs !== 0) {
                    replaceEdits.push(vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(i, 0, i, textBuff.getLineLength(i)), newText));
                }
            }
            if (replaceEdits.length > 0) {
                result.push(vscode_languageserver_1.CodeAction.create('Convert all Tabs to Spaces', createWorkspaceEdit(document.uri, replaceEdits), vscode_languageserver_1.CodeActionKind.QuickFix));
            }
        }
        return result;
    }
}
exports.YamlCodeActions = YamlCodeActions;
function createWorkspaceEdit(uri, edits) {
    const changes = {};
    changes[uri] = edits;
    const edit = {
        changes,
    };
    return edit;
}
//# sourceMappingURL=yamlCodeActions.js.map