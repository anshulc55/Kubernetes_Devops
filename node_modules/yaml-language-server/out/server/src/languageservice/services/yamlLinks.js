"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLinks = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const jsonLinks_1 = require("vscode-json-languageservice/lib/umd/services/jsonLinks");
const yaml_documents_1 = require("../parser/yaml-documents");
function findLinks(document) {
    const doc = yaml_documents_1.yamlDocumentsCache.getYamlDocument(document);
    // Find links across all YAML Documents then report them back once finished
    const linkPromises = [];
    for (const yamlDoc of doc.documents) {
        linkPromises.push(jsonLinks_1.findLinks(document, yamlDoc));
    }
    // Wait for all the promises to return and then flatten them into one DocumentLink array
    return Promise.all(linkPromises).then((yamlLinkArray) => [].concat(...yamlLinkArray));
}
exports.findLinks = findLinks;
//# sourceMappingURL=yamlLinks.js.map