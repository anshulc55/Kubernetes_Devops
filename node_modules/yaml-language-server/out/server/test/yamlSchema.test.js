"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const SchemaService = require("../src/languageservice/services/yamlSchemaService");
const url = require("url");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);
const workspaceContext = {
    resolveRelativePath: (relativePath, resource) => {
        return url.resolve(resource, relativePath);
    },
};
describe('YAML Schema', () => {
    const sandbox = sinon.createSandbox();
    let requestServiceStub;
    beforeEach(() => {
        requestServiceStub = sandbox.stub();
    });
    afterEach(() => {
        sandbox.restore();
    });
    it('Loading yaml scheme', () => __awaiter(void 0, void 0, void 0, function* () {
        requestServiceStub.resolves(`
    properties:
      fooBar:
        items:
          type: string
        type: array
    type: object
    `);
        const service = new SchemaService.YAMLSchemaService(requestServiceStub, workspaceContext);
        const result = yield service.loadSchema('fooScheme.yaml');
        expect(requestServiceStub.calledOnceWith('fooScheme.yaml'));
        expect(result.schema.properties['fooBar']).eql({
            items: { type: 'string' },
            type: 'array',
        });
    }));
    it('Error while loading yaml', () => __awaiter(void 0, void 0, void 0, function* () {
        requestServiceStub.rejects();
        const service = new SchemaService.YAMLSchemaService(requestServiceStub, workspaceContext);
        const result = yield service.loadSchema('fooScheme.yaml');
        expect(result.errors).length(1);
        expect(result.errors[0]).includes('Unable to load schema from');
    }));
    it('Error while parsing yaml scheme', () => __awaiter(void 0, void 0, void 0, function* () {
        requestServiceStub.resolves(`%464*&^^&*%@$&^##$`);
        const service = new SchemaService.YAMLSchemaService(requestServiceStub, workspaceContext);
        const result = yield service.loadSchema('fooScheme.yaml');
        expect(requestServiceStub.calledOnceWith('fooScheme.yaml'));
        expect(result.errors).length(1);
        expect(result.errors[0]).includes('Unable to parse content from');
    }));
});
//# sourceMappingURL=yamlSchema.test.js.map