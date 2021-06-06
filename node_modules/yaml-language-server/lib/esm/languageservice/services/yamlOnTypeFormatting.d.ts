import { DocumentOnTypeFormattingParams, TextEdit } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
export declare function doDocumentOnTypeFormatting(document: TextDocument, params: DocumentOnTypeFormattingParams): TextEdit[] | undefined;
