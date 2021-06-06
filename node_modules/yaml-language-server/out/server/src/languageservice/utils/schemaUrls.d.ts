import { WorkspaceFolder } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import { Telemetry } from '../../languageserver/telemetry';
export declare const KUBERNETES_SCHEMA_URL = "https://raw.githubusercontent.com/yannh/kubernetes-json-schema/master/v1.20.5-standalone-strict/all.json";
export declare const JSON_SCHEMASTORE_URL = "https://www.schemastore.org/api/json/catalog.json";
export declare function checkSchemaURI(workspaceFolders: WorkspaceFolder[], workspaceRoot: URI, uri: string, telemetry: Telemetry): string;
