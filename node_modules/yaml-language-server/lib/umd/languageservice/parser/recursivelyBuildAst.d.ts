import * as Yaml from 'yaml-language-server-parser';
import { ASTNode } from '../jsonASTTypes';
export default function recursivelyBuildAst(parent: ASTNode, node: Yaml.YAMLNode): ASTNode;
