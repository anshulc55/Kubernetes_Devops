

declare function require(n: string): any

'use strict';

import { Type } from '../type';
import ast = require('../yamlAST');

function resolveYamlBoolean(nodeOrString: ast.YAMLNode | string) {
  const booleanValue = ast.isYAMLNode(nodeOrString) ? nodeOrString.value : nodeOrString;
  if (null === booleanValue) {
    return false;
  }

  var max = booleanValue.length;

  return (max === 4 && (booleanValue === 'true' || booleanValue === 'True' || booleanValue === 'TRUE')) ||
    (max === 5 && (booleanValue === 'false' || booleanValue === 'False' || booleanValue === 'FALSE'));
}

function constructYamlBoolean(nodeOrString: ast.YAMLNode | string) {
  if (ast.isYAMLNode(nodeOrString)) {
    // YAML Boolean is already constructed
    return nodeOrString;
  }
  return nodeOrString === 'true' ||
    nodeOrString === 'True' ||
    nodeOrString === 'TRUE';
}

function isBoolean(object) {
  return '[object Boolean]' === Object.prototype.toString.call(object);
}

export = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});
