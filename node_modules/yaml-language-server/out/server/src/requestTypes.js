"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaModificationNotification = exports.ColorSymbolRequest = exports.CustomSchemaRequest = exports.CustomSchemaContentRequest = exports.VSCodeContentRequest = exports.ResultLimitReachedNotification = exports.VSCodeContentRequestRegistration = exports.DynamicCustomSchemaRequestRegistration = exports.SchemaAssociationNotification = void 0;
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-namespace */
const vscode_languageserver_1 = require("vscode-languageserver");
var SchemaAssociationNotification;
(function (SchemaAssociationNotification) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SchemaAssociationNotification.type = new vscode_languageserver_1.NotificationType('json/schemaAssociations');
})(SchemaAssociationNotification = exports.SchemaAssociationNotification || (exports.SchemaAssociationNotification = {}));
var DynamicCustomSchemaRequestRegistration;
(function (DynamicCustomSchemaRequestRegistration) {
    DynamicCustomSchemaRequestRegistration.type = new vscode_languageserver_1.NotificationType('yaml/registerCustomSchemaRequest');
})(DynamicCustomSchemaRequestRegistration = exports.DynamicCustomSchemaRequestRegistration || (exports.DynamicCustomSchemaRequestRegistration = {}));
var VSCodeContentRequestRegistration;
(function (VSCodeContentRequestRegistration) {
    VSCodeContentRequestRegistration.type = new vscode_languageserver_1.NotificationType('yaml/registerContentRequest');
})(VSCodeContentRequestRegistration = exports.VSCodeContentRequestRegistration || (exports.VSCodeContentRequestRegistration = {}));
var ResultLimitReachedNotification;
(function (ResultLimitReachedNotification) {
    ResultLimitReachedNotification.type = new vscode_languageserver_1.NotificationType('yaml/resultLimitReached');
})(ResultLimitReachedNotification = exports.ResultLimitReachedNotification || (exports.ResultLimitReachedNotification = {}));
var VSCodeContentRequest;
(function (VSCodeContentRequest) {
    VSCodeContentRequest.type = new vscode_languageserver_1.RequestType('vscode/content');
})(VSCodeContentRequest = exports.VSCodeContentRequest || (exports.VSCodeContentRequest = {}));
var CustomSchemaContentRequest;
(function (CustomSchemaContentRequest) {
    CustomSchemaContentRequest.type = new vscode_languageserver_1.RequestType('custom/schema/content');
})(CustomSchemaContentRequest = exports.CustomSchemaContentRequest || (exports.CustomSchemaContentRequest = {}));
var CustomSchemaRequest;
(function (CustomSchemaRequest) {
    CustomSchemaRequest.type = new vscode_languageserver_1.RequestType('custom/schema/request');
})(CustomSchemaRequest = exports.CustomSchemaRequest || (exports.CustomSchemaRequest = {}));
var ColorSymbolRequest;
(function (ColorSymbolRequest) {
    ColorSymbolRequest.type = new vscode_languageserver_1.RequestType('json/colorSymbols');
})(ColorSymbolRequest = exports.ColorSymbolRequest || (exports.ColorSymbolRequest = {}));
var SchemaModificationNotification;
(function (SchemaModificationNotification) {
    SchemaModificationNotification.type = new vscode_languageserver_1.RequestType('json/schema/modify');
})(SchemaModificationNotification = exports.SchemaModificationNotification || (exports.SchemaModificationNotification = {}));
//# sourceMappingURL=requestTypes.js.map