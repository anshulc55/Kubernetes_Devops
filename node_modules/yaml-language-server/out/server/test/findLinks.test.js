"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const testHelper_1 = require("./utils/testHelper");
const assert = require("assert");
const serviceSetup_1 = require("./utils/serviceSetup");
const yamlSettings_1 = require("../src/yamlSettings");
describe('FindDefintion Tests', () => {
    let languageHandler;
    let yamlSettings;
    before(() => {
        const languageSettingsSetup = new serviceSetup_1.ServiceSetup();
        const { languageHandler: langHandler, yamlSettings: settings } = testHelper_1.setupLanguageService(languageSettingsSetup.languageSettings);
        languageHandler = langHandler;
        yamlSettings = settings;
    });
    describe('Jump to definition', function () {
        function findLinks(content) {
            const testTextDocument = testHelper_1.setupTextDocument(content);
            yamlSettings.documents = new yamlSettings_1.TextDocumentTestManager();
            yamlSettings.documents.set(testTextDocument);
            return languageHandler.documentLinkHandler({
                textDocument: testTextDocument,
            });
        }
        it('Find source definition', (done) => {
            const content = "definitions:\n  link:\n    type: string\ntype: object\nproperties:\n  uri:\n    $ref: '#/definitions/link'\n";
            const definitions = findLinks(content);
            definitions
                .then(function (results) {
                assert.equal(results.length, 1);
                assert.deepEqual(results[0].range, {
                    start: {
                        line: 6,
                        character: 11,
                    },
                    end: {
                        line: 6,
                        character: 29,
                    },
                });
                assert.deepEqual(results[0].target, 'file://~/Desktop/vscode-k8s/test.yaml#3,5');
            })
                .then(done, done);
        });
    });
});
//# sourceMappingURL=findLinks.test.js.map