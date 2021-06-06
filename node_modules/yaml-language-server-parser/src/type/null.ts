

'use strict';

import { Type } from '../type';
import ast = require('../yamlAST');

function resolveYamlNull(nodeOrString: ast.YAMLNode | string) {
  const nullValue = ast.isYAMLNode(nodeOrString) ? (nodeOrString as ast.YAMLNode).value : nodeOrString;
  if (null === nullValue) {
    return true;
  }

  var max = nullValue.length;

  return (max === 1 && nullValue === '~') ||
    (max === 4 && (nullValue === 'null' || nullValue === 'Null' || nullValue === 'NULL'));
}

function constructYamlNull(nodeOrString?: ast.YAMLNode | string) {
  if (ast.isYAMLNode(nodeOrString)) {
    return nodeOrString;
  }
  return null;
}

function isNull(object) {
  return null === object;
}

export = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~'; },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; }
  },
  defaultStyle: 'lowercase'
});
