"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const YAML = require("../src");
const schema_1 = require("../src/schema");
const type_1 = require("../src/type");
suite('Multiple Custom Tag Kinds ', () => {
    function multipleKindsHelper(customTags, textInput) {
        const yamlDocs = [];
        let schemaWithAdditionalTags = schema_1.Schema.create(customTags.map((tag) => {
            const typeInfo = tag.split(' ');
            return new type_1.Type(typeInfo[0], { kind: typeInfo[1] || 'scalar' });
        }));
        const tagWithAdditionalItems = new Map();
        customTags.forEach(tag => {
            const typeInfo = tag.split(' ');
            const tagName = typeInfo[0];
            const tagType = (typeInfo[1] && typeInfo[1].toLowerCase()) || 'scalar';
            if (tagWithAdditionalItems.has(tagName)) {
                tagWithAdditionalItems.set(tagName, tagWithAdditionalItems.get(tagName).concat([tagType]));
            }
            else {
                tagWithAdditionalItems.set(tagName, [tagType]);
            }
        });
        tagWithAdditionalItems.forEach((additionalTagKinds, key) => {
            const newTagType = new type_1.Type(key, { kind: additionalTagKinds[0] || 'scalar' });
            newTagType.additionalKinds = additionalTagKinds;
            schemaWithAdditionalTags.compiledTypeMap[key] = newTagType;
        });
        let additionalOptions = {
            schema: schemaWithAdditionalTags
        };
        YAML.loadAll(textInput, doc => yamlDocs.push(doc), additionalOptions);
        return yamlDocs;
    }
    function checkDocumentsForNoErrors(documents) {
        documents.forEach(element => {
            chai_1.assert.equal(element.errors.length, 0);
        });
    }
    function checkDocumentsForErrors(documents, expectedErrorCount) {
        let errorCount = 0;
        documents.forEach(element => {
            errorCount += element.errors.length;
        });
        chai_1.assert.equal(errorCount, expectedErrorCount);
    }
    test('Allow one custom tag type', function () {
        let customTags = ["!test scalar"];
        const f = multipleKindsHelper(customTags, "!test");
        checkDocumentsForNoErrors(f);
    });
    test('Allow multiple different custom tag types', function () {
        let customTags = ["!test scalar", "!test mapping"];
        const f = multipleKindsHelper(customTags, "!test");
        checkDocumentsForNoErrors(f);
    });
    test('Allow multiple different custom tag types with different use', function () {
        let customTags = ["!test scalar", "!test mapping"];
        const f = multipleKindsHelper(customTags, "!test\nhello: !test\n  world");
        checkDocumentsForNoErrors(f);
    });
    test('Allow multiple different custom tag types with multiple different uses', function () {
        let customTags = ["!test scalar", "!test mapping", "!ref sequence", "!ref mapping"];
        const f = multipleKindsHelper(customTags, "!test\nhello: !test\n  world\nsequence: !ref\n  - item1");
        checkDocumentsForNoErrors(f);
    });
    test('Error when custom tag is not available', function () {
        let customTags = [];
        const f = multipleKindsHelper(customTags, "!test");
        checkDocumentsForErrors(f, 1);
    });
});
//# sourceMappingURL=multipleKinds.test.js.map