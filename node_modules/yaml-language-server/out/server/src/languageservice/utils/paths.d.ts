import { WorkspaceFolder, WorkspaceFoldersChangeEvent } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
export declare const isRelativePath: (path: string) => boolean;
export declare const relativeToAbsolutePath: (workspaceFolders: WorkspaceFolder[], workspaceRoot: URI, uri: string) => string;
export declare const workspaceFoldersChanged: (workspaceFolders: WorkspaceFolder[], changedFolders: WorkspaceFoldersChangeEvent) => WorkspaceFolder[];
