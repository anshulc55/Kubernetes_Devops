'use strict';
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
const assert = require("assert");
const parser = require("../src/languageservice/parser/yamlParser07");
const SchemaService = require("../src/languageservice/services/yamlSchemaService");
const url = require("url");
const path = require("path");
const request_light_1 = require("request-light");
const yamlSchemaService_1 = require("../src/languageservice/services/yamlSchemaService");
const schemaUrls_1 = require("../src/languageservice/utils/schemaUrls");
const chai_1 = require("chai");
const serviceSetup_1 = require("./utils/serviceSetup");
const testHelper_1 = require("./utils/testHelper");
const src_1 = require("../src");
const vscode_languageserver_1 = require("vscode-languageserver");
const requestServiceMock = function (uri) {
    return Promise.reject(`Resource ${uri} not found.`);
};
const workspaceContext = {
    resolveRelativePath: (relativePath, resource) => {
        return url.resolve(resource, relativePath);
    },
};
const schemaRequestServiceForURL = (uri) => {
    const headers = { 'Accept-Encoding': 'gzip, deflate' };
    return request_light_1.xhr({ url: uri, followRedirects: 5, headers }).then((response) => {
        return response.responseText;
    }, (error) => {
        return Promise.reject(error.responseText || error.toString());
    });
};
describe('JSON Schema', () => {
    let languageSettingsSetup;
    let languageService;
    before(() => {
        languageSettingsSetup = new serviceSetup_1.ServiceSetup()
            .withValidate()
            .withCustomTags(['!Test', '!Ref sequence'])
            .withSchemaFileMatch({ uri: schemaUrls_1.KUBERNETES_SCHEMA_URL, fileMatch: ['.drone.yml'] })
            .withSchemaFileMatch({ uri: 'https://json.schemastore.org/drone', fileMatch: ['.drone.yml'] })
            .withSchemaFileMatch({ uri: schemaUrls_1.KUBERNETES_SCHEMA_URL, fileMatch: ['test.yml'] })
            .withSchemaFileMatch({ uri: 'https://json.schemastore.org/composer', fileMatch: ['test.yml'] });
        const { languageService: langService } = testHelper_1.setupLanguageService(languageSettingsSetup.languageSettings);
        languageService = langService;
    });
    it('Resolving $refs', function (testDone) {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service.setSchemaContributions({
            schemas: {
                'https://myschemastore/main': {
                    id: 'https://myschemastore/main',
                    type: 'object',
                    properties: {
                        child: {
                            $ref: 'https://myschemastore/child',
                        },
                    },
                },
                'https://myschemastore/child': {
                    id: 'https://myschemastore/child',
                    type: 'bool',
                    description: 'Test description',
                },
            },
        });
        service
            .getResolvedSchema('https://myschemastore/main')
            .then((solvedSchema) => {
            assert.deepEqual(solvedSchema.schema.properties['child'], {
                id: 'https://myschemastore/child',
                type: 'bool',
                description: 'Test description',
                _$ref: 'https://myschemastore/child',
                url: 'https://myschemastore/child',
            });
        })
            .then(() => {
            return testDone();
        }, (error) => {
            testDone(error);
        });
    });
    it('Resolving $refs 2', function (testDone) {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service.setSchemaContributions({
            schemas: {
                'https://json.schemastore.org/swagger-2.0': {
                    id: 'https://json.schemastore.org/swagger-2.0',
                    type: 'object',
                    properties: {
                        responseValue: {
                            $ref: '#/definitions/jsonReference',
                        },
                    },
                    definitions: {
                        jsonReference: {
                            type: 'object',
                            required: ['$ref'],
                            properties: {
                                $ref: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        });
        service
            .getResolvedSchema('https://json.schemastore.org/swagger-2.0')
            .then((fs) => {
            assert.deepEqual(fs.schema.properties['responseValue'], {
                type: 'object',
                required: ['$ref'],
                properties: { $ref: { type: 'string' } },
                _$ref: '#/definitions/jsonReference',
            });
        })
            .then(() => {
            return testDone();
        }, (error) => {
            testDone(error);
        });
    });
    it('Resolving $refs 3', function (testDone) {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service.setSchemaContributions({
            schemas: {
                'https://myschemastore/main/schema1.json': {
                    id: 'https://myschemastore/schema1.json',
                    type: 'object',
                    properties: {
                        p1: {
                            $ref: 'schema2.json#/definitions/hello',
                        },
                        p2: {
                            $ref: './schema2.json#/definitions/hello',
                        },
                        p3: {
                            $ref: '/main/schema2.json#/definitions/hello',
                        },
                    },
                },
                'https://myschemastore/main/schema2.json': {
                    id: 'https://myschemastore/main/schema2.json',
                    definitions: {
                        hello: {
                            type: 'string',
                            enum: ['object'],
                        },
                    },
                },
            },
        });
        service
            .getResolvedSchema('https://myschemastore/main/schema1.json')
            .then((fs) => {
            assert.deepEqual(fs.schema.properties['p1'], {
                type: 'string',
                enum: ['object'],
                _$ref: 'schema2.json#/definitions/hello',
                url: 'https://myschemastore/main/schema2.json',
            });
            assert.deepEqual(fs.schema.properties['p2'], {
                type: 'string',
                enum: ['object'],
                _$ref: './schema2.json#/definitions/hello',
                url: 'https://myschemastore/main/schema2.json',
            });
            assert.deepEqual(fs.schema.properties['p3'], {
                type: 'string',
                enum: ['object'],
                _$ref: '/main/schema2.json#/definitions/hello',
                url: 'https://myschemastore/main/schema2.json',
            });
        })
            .then(() => {
            return testDone();
        }, (error) => {
            testDone(error);
        });
    });
    it('FileSchema', function (testDone) {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service.setSchemaContributions({
            schemas: {
                main: {
                    id: 'main',
                    type: 'object',
                    properties: {
                        child: {
                            type: 'object',
                            properties: {
                                grandchild: {
                                    type: 'number',
                                    description: 'Meaning of Life',
                                },
                            },
                        },
                    },
                },
            },
        });
        service
            .getResolvedSchema('main')
            .then((fs) => {
            const section = fs.getSection(['child', 'grandchild']);
            assert.equal(section.description, 'Meaning of Life');
        })
            .then(() => {
            return testDone();
        }, (error) => {
            testDone(error);
        });
    });
    it('Array FileSchema', function (testDone) {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service.setSchemaContributions({
            schemas: {
                main: {
                    id: 'main',
                    type: 'object',
                    properties: {
                        child: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    grandchild: {
                                        type: 'number',
                                        description: 'Meaning of Life',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        service
            .getResolvedSchema('main')
            .then((fs) => {
            const section = fs.getSection(['child', '0', 'grandchild']);
            assert.equal(section.description, 'Meaning of Life');
        })
            .then(() => {
            return testDone();
        }, (error) => {
            testDone(error);
        });
    });
    it('Missing subschema', function (testDone) {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service.setSchemaContributions({
            schemas: {
                main: {
                    id: 'main',
                    type: 'object',
                    properties: {
                        child: {
                            type: 'object',
                        },
                    },
                },
            },
        });
        service
            .getResolvedSchema('main')
            .then((fs) => {
            const section = fs.getSection(['child', 'grandchild']);
            assert.strictEqual(section, undefined);
        })
            .then(() => {
            return testDone();
        }, (error) => {
            testDone(error);
        });
    });
    it('Preloaded Schema', function (testDone) {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        const id = 'https://myschemastore/test1';
        const schema = {
            type: 'object',
            properties: {
                child: {
                    type: 'object',
                    properties: {
                        grandchild: {
                            type: 'number',
                            description: 'Meaning of Life',
                        },
                    },
                },
            },
        };
        service.registerExternalSchema(id, ['*.json'], schema);
        service
            .getSchemaForResource('test.json', undefined)
            .then((schema) => {
            const section = schema.getSection(['child', 'grandchild']);
            assert.equal(section.description, 'Meaning of Life');
        })
            .then(() => {
            return testDone();
        }, (error) => {
            testDone(error);
        });
    });
    it('Schema has url', () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        const id = 'https://myschemastore/test1';
        const schema = {
            type: 'object',
            properties: {
                child: {
                    type: 'object',
                    properties: {
                        grandchild: {
                            type: 'number',
                            description: 'Meaning of Life',
                        },
                    },
                },
            },
        };
        service.registerExternalSchema(id, ['*.json'], schema);
        const result = yield service.getSchemaForResource('test.json', undefined);
        chai_1.expect(result.schema.url).equal(id);
    }));
    it('Null Schema', function (testDone) {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service
            .getSchemaForResource('test.json', undefined)
            .then((schema) => {
            assert.equal(schema, null);
        })
            .then(() => {
            return testDone();
        }, (error) => {
            testDone(error);
        });
    });
    it('Schema not found', function (testDone) {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service
            .loadSchema('test.json')
            .then((schema) => {
            assert.notEqual(schema.errors.length, 0);
        })
            .then(() => {
            return testDone();
        }, (error) => {
            testDone(error);
        });
    });
    it('Schema with non uri registers correctly', function (testDone) {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        const non_uri = 'non_uri';
        service.registerExternalSchema(non_uri, ['*.yml', '*.yaml'], {
            properties: {
                test_node: {
                    description: 'my test_node description',
                    enum: ['test 1', 'test 2'],
                },
            },
        });
        service.getResolvedSchema(non_uri).then((schema) => {
            assert.notEqual(schema, undefined);
            testDone();
        });
    });
    it('Modifying schema', () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service.setSchemaContributions({
            schemas: {
                'https://myschemastore/main/schema1.json': {
                    type: 'object',
                    properties: {
                        apiVersion: {
                            type: 'string',
                            enum: ['v1'],
                        },
                        kind: {
                            type: 'string',
                            enum: ['Pod'],
                        },
                    },
                },
            },
        });
        yield service.addContent({
            action: yamlSchemaService_1.MODIFICATION_ACTIONS.add,
            path: 'properties/apiVersion',
            key: 'enum',
            content: ['v2', 'v3'],
            schema: 'https://myschemastore/main/schema1.json',
        });
        const fs = yield service.getResolvedSchema('https://myschemastore/main/schema1.json');
        assert.deepEqual(fs.schema.properties['apiVersion'], {
            type: 'string',
            enum: ['v2', 'v3'],
        });
        assert.deepEqual(fs.schema.properties['kind'], {
            type: 'string',
            enum: ['Pod'],
        });
    }));
    it('Deleting schema', () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service.setSchemaContributions({
            schemas: {
                'https://myschemastore/main/schema1.json': {
                    type: 'object',
                    properties: {
                        apiVersion: {
                            type: 'string',
                            enum: ['v1'],
                        },
                        kind: {
                            type: 'string',
                            enum: ['Pod'],
                        },
                    },
                },
            },
        });
        yield service.deleteContent({
            action: yamlSchemaService_1.MODIFICATION_ACTIONS.delete,
            path: 'properties',
            key: 'apiVersion',
            schema: 'https://myschemastore/main/schema1.json',
        });
        const fs = yield service.getResolvedSchema('https://myschemastore/main/schema1.json');
        assert.notDeepEqual(fs.schema.properties['apiVersion'], {
            type: 'string',
            enum: ['v2', 'v3'],
        });
        assert.equal(fs.schema.properties['apiVersion'], undefined);
        assert.deepEqual(fs.schema.properties['kind'], {
            type: 'string',
            enum: ['Pod'],
        });
    }));
    it('Deleting schemas', () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new SchemaService.YAMLSchemaService(requestServiceMock, workspaceContext);
        service.setSchemaContributions({
            schemas: {
                'https://myschemastore/main/schema1.json': {
                    type: 'object',
                },
            },
        });
        yield service.deleteSchemas({
            action: yamlSchemaService_1.MODIFICATION_ACTIONS.deleteAll,
            schemas: ['https://myschemastore/main/schema1.json'],
        });
        const fs = yield service.getResolvedSchema('https://myschemastore/main/schema1.json');
        assert.equal(fs, undefined);
    }));
    it('Modifying schema works with kubernetes resolution', () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new SchemaService.YAMLSchemaService(schemaRequestServiceForURL, workspaceContext);
        service.registerExternalSchema(schemaUrls_1.KUBERNETES_SCHEMA_URL);
        yield service.addContent({
            action: yamlSchemaService_1.MODIFICATION_ACTIONS.add,
            path: 'oneOf/1/properties/kind',
            key: 'enum',
            content: ['v2', 'v3'],
            schema: schemaUrls_1.KUBERNETES_SCHEMA_URL,
        });
        const fs = yield service.getResolvedSchema(schemaUrls_1.KUBERNETES_SCHEMA_URL);
        assert.deepEqual(fs.schema.oneOf[1].properties['kind']['enum'], ['v2', 'v3']);
    }));
    it('Deleting schema works with Kubernetes resolution', () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new SchemaService.YAMLSchemaService(schemaRequestServiceForURL, workspaceContext);
        service.registerExternalSchema(schemaUrls_1.KUBERNETES_SCHEMA_URL);
        yield service.deleteContent({
            action: yamlSchemaService_1.MODIFICATION_ACTIONS.delete,
            path: 'oneOf/1/properties/kind',
            key: 'enum',
            schema: schemaUrls_1.KUBERNETES_SCHEMA_URL,
        });
        const fs = yield service.getResolvedSchema(schemaUrls_1.KUBERNETES_SCHEMA_URL);
        assert.equal(fs.schema.oneOf[1].properties['kind']['enum'], undefined);
    }));
    it('Adding a brand new schema', () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new SchemaService.YAMLSchemaService(schemaRequestServiceForURL, workspaceContext);
        service.saveSchema('hello_world', {
            enum: ['test1', 'test2'],
        });
        const hello_world_schema = yield service.getResolvedSchema('hello_world');
        assert.deepEqual(hello_world_schema.schema.enum, ['test1', 'test2']);
    }));
    it('Deleting an existing schema', () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new SchemaService.YAMLSchemaService(schemaRequestServiceForURL, workspaceContext);
        service.saveSchema('hello_world', {
            enum: ['test1', 'test2'],
        });
        yield service.deleteSchema('hello_world');
        const hello_world_schema = yield service.getResolvedSchema('hello_world');
        assert.equal(hello_world_schema, null);
    }));
    describe('Test schema priority', function () {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const schemaAssociationSample = require(path.join(__dirname, './fixtures/sample-association.json'));
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const schemaStoreSample = require(path.join(__dirname, './fixtures/sample-schemastore.json'));
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const schemaSettingsSample = require(path.join(__dirname, './fixtures/sample-settings.json'));
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const schemaModelineSample = require(path.join(__dirname, './fixtures/sample-modeline.json'));
        const languageSettingsSetup = new serviceSetup_1.ServiceSetup().withCompletion();
        it('Modeline Schema takes precendence over all other schemas', () => __awaiter(this, void 0, void 0, function* () {
            languageSettingsSetup
                .withSchemaFileMatch({
                fileMatch: ['test.yaml'],
                uri: testHelper_1.TEST_URI,
                priority: src_1.SchemaPriority.SchemaStore,
                schema: schemaStoreSample,
            })
                .withSchemaFileMatch({
                fileMatch: ['test.yaml'],
                uri: testHelper_1.TEST_URI,
                priority: src_1.SchemaPriority.SchemaAssociation,
                schema: schemaAssociationSample,
            })
                .withSchemaFileMatch({
                fileMatch: ['test.yaml'],
                uri: testHelper_1.TEST_URI,
                priority: src_1.SchemaPriority.Settings,
                schema: schemaSettingsSample,
            })
                .withSchemaFileMatch({
                fileMatch: ['test.yaml'],
                uri: testHelper_1.TEST_URI,
                priority: src_1.SchemaPriority.Modeline,
                schema: schemaModelineSample,
            });
            languageService.configure(languageSettingsSetup.languageSettings);
            const testTextDocument = testHelper_1.setupTextDocument('');
            const result = yield languageService.doComplete(testTextDocument, vscode_languageserver_1.Position.create(0, 0), false);
            assert.strictEqual(result.items.length, 1);
            assert.strictEqual(result.items[0].label, 'modeline');
        }));
        it('Manually setting schema takes precendence over all other lower priority schemas', () => __awaiter(this, void 0, void 0, function* () {
            languageSettingsSetup
                .withSchemaFileMatch({
                fileMatch: ['test.yaml'],
                uri: testHelper_1.TEST_URI,
                priority: src_1.SchemaPriority.SchemaStore,
                schema: schemaStoreSample,
            })
                .withSchemaFileMatch({
                fileMatch: ['test.yaml'],
                uri: testHelper_1.TEST_URI,
                priority: src_1.SchemaPriority.SchemaAssociation,
                schema: schemaAssociationSample,
            })
                .withSchemaFileMatch({
                fileMatch: ['test.yaml'],
                uri: testHelper_1.TEST_URI,
                priority: src_1.SchemaPriority.Settings,
                schema: schemaSettingsSample,
            });
            languageService.configure(languageSettingsSetup.languageSettings);
            const testTextDocument = testHelper_1.setupTextDocument('');
            const result = yield languageService.doComplete(testTextDocument, vscode_languageserver_1.Position.create(0, 0), false);
            assert.strictEqual(result.items.length, 1);
            assert.strictEqual(result.items[0].label, 'settings');
        }));
        it('SchemaAssociation takes precendence over SchemaStore', () => __awaiter(this, void 0, void 0, function* () {
            languageSettingsSetup
                .withSchemaFileMatch({
                fileMatch: ['test.yaml'],
                uri: testHelper_1.TEST_URI,
                priority: src_1.SchemaPriority.SchemaStore,
                schema: schemaStoreSample,
            })
                .withSchemaFileMatch({
                fileMatch: ['test.yaml'],
                uri: testHelper_1.TEST_URI,
                priority: src_1.SchemaPriority.SchemaAssociation,
                schema: schemaAssociationSample,
            });
            languageService.configure(languageSettingsSetup.languageSettings);
            const testTextDocument = testHelper_1.setupTextDocument('');
            const result = yield languageService.doComplete(testTextDocument, vscode_languageserver_1.Position.create(0, 0), false);
            assert.strictEqual(result.items.length, 1);
            assert.strictEqual(result.items[0].label, 'association');
        }));
        it('SchemaStore is highest priority if nothing else is available', () => __awaiter(this, void 0, void 0, function* () {
            languageSettingsSetup.withSchemaFileMatch({
                fileMatch: ['test.yaml'],
                uri: testHelper_1.TEST_URI,
                priority: src_1.SchemaPriority.SchemaStore,
                schema: schemaStoreSample,
            });
            languageService.configure(languageSettingsSetup.languageSettings);
            const testTextDocument = testHelper_1.setupTextDocument('');
            const result = yield languageService.doComplete(testTextDocument, vscode_languageserver_1.Position.create(0, 0), false);
            assert.strictEqual(result.items.length, 1);
            assert.strictEqual(result.items[0].label, 'schemastore');
        }));
    });
    describe('Test getSchemaFromModeline', function () {
        it('simple case', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('# yaml-language-server: $schema=expectedUrl', 'expectedUrl');
        }));
        it('with several spaces between # and yaml-language-server', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('#    yaml-language-server: $schema=expectedUrl', 'expectedUrl');
        }));
        it('with several spaces between yaml-language-server and :', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('# yaml-language-server   : $schema=expectedUrl', 'expectedUrl');
        }));
        it('with several spaces between : and $schema', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('# yaml-language-server:    $schema=expectedUrl', 'expectedUrl');
        }));
        it('with several spaces at the end', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('# yaml-language-server: $schema=expectedUrl   ', 'expectedUrl');
        }));
        it('with several spaces at several places', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('#   yaml-language-server  :   $schema=expectedUrl   ', 'expectedUrl');
        }));
        it('with several attributes', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('# yaml-language-server: anotherAttribute=test $schema=expectedUrl aSecondAttribtute=avalue', 'expectedUrl');
        }));
        it('with tabs', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('#\tyaml-language-server:\t$schema=expectedUrl', 'expectedUrl');
        }));
        it('with several $schema - pick the first', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('# yaml-language-server: $schema=url1 $schema=url2', 'url1');
        }));
        it('no schema returned if not yaml-language-server', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('# somethingelse: $schema=url1', undefined);
        }));
        it('no schema returned if not $schema', () => __awaiter(this, void 0, void 0, function* () {
            checkReturnSchemaUrl('# yaml-language-server: $notschema=url1', undefined);
        }));
        function checkReturnSchemaUrl(modeline, expectedResult) {
            const service = new SchemaService.YAMLSchemaService(schemaRequestServiceForURL, workspaceContext);
            const yamlDoc = new parser.SingleYAMLDocument([]);
            yamlDoc.lineComments = [modeline];
            assert.equal(service.getSchemaFromModeline(yamlDoc), expectedResult);
        }
    });
});
//# sourceMappingURL=schema.test.js.map