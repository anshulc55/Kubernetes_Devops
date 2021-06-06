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
const yamlSettings_1 = require("../src/yamlSettings");
const serviceSetup_1 = require("./utils/serviceSetup");
const testHelper_1 = require("./utils/testHelper");
const chai_1 = require("chai");
const verifyError_1 = require("./utils/verifyError");
describe('YAML Validation Tests', () => {
    let languageSettingsSetup;
    let validationHandler;
    let yamlSettings;
    before(() => {
        languageSettingsSetup = new serviceSetup_1.ServiceSetup().withValidate();
        const { validationHandler: valHandler, yamlSettings: settings } = testHelper_1.setupLanguageService(languageSettingsSetup.languageSettings);
        validationHandler = valHandler;
        yamlSettings = settings;
    });
    function parseSetup(content, customSchemaID) {
        const testTextDocument = testHelper_1.setupSchemaIDTextDocument(content, customSchemaID);
        yamlSettings.documents = new yamlSettings_1.TextDocumentTestManager();
        yamlSettings.documents.set(testTextDocument);
        return validationHandler.validateTextDocument(testTextDocument);
    }
    describe('TAB Character diagnostics', () => {
        it('Should report if TAB character present', () => __awaiter(void 0, void 0, void 0, function* () {
            const yaml = 'foo:\n\t- bar';
            const result = yield parseSetup(yaml);
            chai_1.expect(result).is.not.empty;
            chai_1.expect(result.length).to.be.equal(1);
            chai_1.expect(result[0]).deep.equal(verifyError_1.createExpectedError('Using tabs can lead to unpredictable results', 1, 0, 1, 1));
        }));
        it('Should report one error for TAB character present in a row', () => __awaiter(void 0, void 0, void 0, function* () {
            const yaml = 'foo:\n\t\t- bar';
            const result = yield parseSetup(yaml);
            chai_1.expect(result).is.not.empty;
            chai_1.expect(result.length).to.be.equal(1);
            chai_1.expect(result[0]).deep.equal(verifyError_1.createExpectedError('Using tabs can lead to unpredictable results', 1, 0, 1, 2));
        }));
        it('Should report one error for TAB`s characters present in the middle of indentation', () => __awaiter(void 0, void 0, void 0, function* () {
            const yaml = 'foo:\n \t\t\t - bar';
            const result = yield parseSetup(yaml);
            chai_1.expect(result).is.not.empty;
            chai_1.expect(result.length).to.be.equal(1);
            chai_1.expect(result[0]).deep.equal(verifyError_1.createExpectedError('Using tabs can lead to unpredictable results', 1, 1, 1, 4));
        }));
    });
});
//# sourceMappingURL=yamlValidation.test.js.map