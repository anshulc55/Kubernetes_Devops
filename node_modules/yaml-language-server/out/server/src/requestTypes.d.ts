import { NotificationType, RequestType } from 'vscode-languageserver';
import { SchemaAdditions, SchemaDeletions } from './languageservice/services/yamlSchemaService';
import { SchemaConfiguration } from './languageservice/yamlLanguageService';
export declare type ISchemaAssociations = Record<string, string[]>;
export declare namespace SchemaAssociationNotification {
    const type: NotificationType<ISchemaAssociations | SchemaConfiguration[]>;
}
export declare namespace DynamicCustomSchemaRequestRegistration {
    const type: NotificationType<{}>;
}
export declare namespace VSCodeContentRequestRegistration {
    const type: NotificationType<{}>;
}
export declare namespace ResultLimitReachedNotification {
    const type: NotificationType<string>;
}
export declare namespace VSCodeContentRequest {
    const type: RequestType<{}, {}, {}>;
}
export declare namespace CustomSchemaContentRequest {
    const type: RequestType<{}, {}, {}>;
}
export declare namespace CustomSchemaRequest {
    const type: RequestType<{}, {}, {}>;
}
export declare namespace ColorSymbolRequest {
    const type: RequestType<{}, {}, {}>;
}
export declare namespace SchemaModificationNotification {
    const type: RequestType<SchemaAdditions | SchemaDeletions, void, {}>;
}
