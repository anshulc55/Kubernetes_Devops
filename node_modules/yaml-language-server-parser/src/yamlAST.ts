
/**
 * Created by kor on 06/05/15.
 */
import YAMLException = require('./exception');
export enum Kind {
    SCALAR,
    MAPPING,
    MAP,
    SEQ,
    ANCHOR_REF,
    INCLUDE_REF
}

export interface YAMLDocument {
    startPosition: number
    endPosition: number
    errors: YAMLException[]
}
export interface YAMLNode extends YAMLDocument {
    startPosition: number
    endPosition: number
    kind: Kind
    anchorId?: string
    valueObject?: any
    parent: YAMLNode
    errors: YAMLException[]
    /**
     * @deprecated Inspect kind and cast to the appropriate subtype instead.
     */
    value?: any

    /**
     * @deprecated Inspect kind and cast to the appropriate subtype instead.
     */
    key?: any

    /**
     * @deprecated Inspect kind and cast to the appropriate subtype instead.
     */
    mappings?: any
}

export interface YAMLAnchorReference extends YAMLNode {
    referencesAnchor: string
    value: YAMLNode
}
export interface YAMLScalar extends YAMLNode {
    value: string
    doubleQuoted?: boolean
    singleQuoted?: boolean
    plainScalar?: boolean
    rawValue: string
}

export interface YAMLMapping extends YAMLNode {
    key: YAMLNode
    value: YAMLNode
}
export interface YAMLSequence extends YAMLNode {
    items: YAMLNode[]
}
export interface YamlMap extends YAMLNode {
    mappings: YAMLMapping[]
}
export function newMapping(key: YAMLNode, value: YAMLNode): YAMLMapping {
    var end = (value ? value.endPosition : key.endPosition + 1); //FIXME.workaround, end should be defied by position of ':'
    //console.log('key: ' + key.value + ' ' + key.startPosition + '..' + key.endPosition + ' ' + value + ' end: ' + end);
    var node = {
        key: key,
        value: value,
        startPosition: key.startPosition,
        endPosition: end,
        kind: Kind.MAPPING,
        parent: null,
        errors: []
    };
    return node
}
export function newAnchorRef(key: string, start: number, end: number, value: YAMLNode): YAMLAnchorReference {
    return {
        errors: [],
        referencesAnchor: key,
        value: value,
        startPosition: start,
        endPosition: end,
        kind: Kind.ANCHOR_REF,
        parent: null
    }
}
export function newScalar(v: string | boolean | number = ""): YAMLScalar {
    const result: YAMLScalar = {
        errors: [],
        startPosition: -1,
        endPosition: -1,
        value: "" + v,
        kind: Kind.SCALAR,
        parent: null,
        doubleQuoted: false,
        rawValue: "" + v,
    };
    if (typeof v !== "string") {
        result.valueObject = v;
    }
    return result
}
export function newItems(): YAMLSequence {
    return {
        errors: [],
        startPosition: -1,
        endPosition: -1,
        items: [],
        kind: Kind.SEQ,
        parent: null
    }
}
export function newSeq(): YAMLSequence {
    return newItems();
}
export function newMap(mappings?: YAMLMapping[]): YamlMap {
    return {
        errors: [],
        startPosition: -1,
        endPosition: -1,
        mappings: mappings ? mappings : [],
        kind: Kind.MAP,
        parent: null
    }
}

/**
 * Compare nodes as it described in yaml spec https://yaml.org/spec/1.2/spec.html#equality//
 * 
 * @param a 
 * @param b 
 * 
 * @returns true when the two nodes are equal and false otherwise
 */
export function isNodesEqual(a: YAMLNode, b: YAMLNode): boolean {

    if (!a || !b) {
        return false;
    }

    if (a.kind !== b.kind) {
        return false;
    }

    if (a.kind === Kind.SCALAR) {
        return (<YAMLScalar>a).value === (<YAMLScalar>b).value;
    }

    if (a.kind === Kind.SEQ) {
        const aSeq = <YAMLSequence>a;
        const bSeq = <YAMLSequence>b;
        if (aSeq.items.length !== bSeq.items.length) {
            return false;
        }

        for (let i = 0; i < aSeq.items.length; i++) {
            const elementA = aSeq.items[i];
            const elementB = bSeq.items[i];
            if (!isNodesEqual(elementA, elementB)) {
                return false;
            }
        }
        return true;
    }

    if (a.kind === Kind.MAP) {
        const aMap = <YamlMap>a;
        const bMap = <YamlMap>b;

        if (aMap.mappings.length !== bMap.mappings.length) {
            return false;
        }

        for (const mapA of aMap.mappings) {
            const keyA = mapA.key;
            const valA = mapA.value;
            const mapB = bMap.mappings.find(mapB => isNodesEqual(keyA, mapB.key));
            if (mapB) {
                if (!isNodesEqual(valA, mapB.value)) {
                    return false;
                }
            } else {
                return false;
            }
        }

        return true;
    }

    if (Kind.MAPPING === a.kind) {
        const aAsMapping = <YAMLMapping>a;
        const bAsMapping = <YAMLMapping>b;
        // Recursively determine if the keys are equal
        const eq = isNodesEqual(aAsMapping.key, bAsMapping.key);
        return eq;
    }

    return false;
}

export function isYAMLNode(obj: any): obj is YAMLNode {
    return obj.startPosition !== undefined && obj.endPosition !== undefined && obj.kind !== undefined;
}
