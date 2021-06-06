"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chai = require("chai");
const yaml_documents_1 = require("../src/languageservice/parser/yaml-documents");
const testHelper_1 = require("./utils/testHelper");
const yamlParser = require("../src/languageservice/parser/yamlParser07");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const expect = chai.expect;
chai.use(sinonChai);
describe('YAML Documents Cache Tests', () => {
    const sandbox = sinon.createSandbox();
    let parseStub;
    beforeEach(() => {
        parseStub = sandbox.stub(yamlParser, 'parse');
    });
    afterEach(() => {
        sandbox.restore();
    });
    it('should cache parsed document', () => {
        const cache = new yaml_documents_1.YamlDocuments();
        const doc = testHelper_1.setupTextDocument('foo: bar');
        parseStub.returns({});
        const result1 = cache.getYamlDocument(doc);
        const result2 = cache.getYamlDocument(doc);
        expect(parseStub).calledOnce;
        expect(result1).to.be.equal(result2);
    });
    it('should re parse document if document changed', () => {
        const cache = new yaml_documents_1.YamlDocuments();
        const doc = testHelper_1.setupTextDocument('foo: bar');
        parseStub.onFirstCall().returns({});
        parseStub.onSecondCall().returns({ foo: 'bar' });
        const result1 = cache.getYamlDocument(doc);
        vscode_languageserver_textdocument_1.TextDocument.update(doc, [], 2);
        const result2 = cache.getYamlDocument(doc);
        expect(parseStub).calledTwice;
        expect(result1).to.be.not.equal(result2);
    });
    it('should invalidate cache if custom tags provided', () => {
        const cache = new yaml_documents_1.YamlDocuments();
        const doc = testHelper_1.setupTextDocument('foo: bar');
        parseStub.onFirstCall().returns({});
        parseStub.onSecondCall().returns({ foo: 'bar' });
        const result1 = cache.getYamlDocument(doc);
        const result2 = cache.getYamlDocument(doc, ['some']);
        expect(parseStub).calledTwice;
        expect(result1).to.not.equal(result2);
    });
    it('should use cache if custom tags are same', () => {
        const cache = new yaml_documents_1.YamlDocuments();
        const doc = testHelper_1.setupTextDocument('foo: bar');
        parseStub.onFirstCall().returns({});
        parseStub.onSecondCall().returns({ foo: 'bar' });
        const result1 = cache.getYamlDocument(doc, ['some']);
        const result2 = cache.getYamlDocument(doc, ['some']);
        expect(parseStub).calledOnce;
        expect(result1).to.be.equal(result2);
    });
});
//# sourceMappingURL=yaml-documents.test.js.map