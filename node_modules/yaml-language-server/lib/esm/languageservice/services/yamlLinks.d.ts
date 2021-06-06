import { DocumentLink } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
export declare function findLinks(document: TextDocument): Promise<DocumentLink[]>;
