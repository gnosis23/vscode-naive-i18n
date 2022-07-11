import * as acorn from 'acorn';
import { log } from './log';

type AcornProperty = {
  type: string;
  key: {
    type: string;
    value: string;
    name: string;
  },
  value: {
    type: string;
    value: string;
  },
};

function parseKeyValue(key: { type: string, name: string, value: string }): string {
  if (key.type === 'Identifier') { return key.name; }
  return key.value;
}

/**
 * a naive way to extract the default exported js object to json string
 * eg: 
 *   export default { "s00001": "hello" }
 *   to
 *   { "s00001": "hello" } 
 * @param {string} code JavaScript code 
 * @returns {string}
 */
export function extractJson(code: string): string {
  const program = acorn.parse(code, { ecmaVersion: 2020, sourceType: 'module' });
  // @ts-ignore
  const body: acorn.Node[] = program.body;
  const exportDefaultDecl = body.find(x => x.type === 'ExportDefaultDeclaration');
  if (exportDefaultDecl) {
    // @ts-ignore
    const properties: AcornProperty[] = exportDefaultDecl.declaration.properties;
    const result: Record<string, string> = {};
    properties.forEach(item => {
      result[parseKeyValue(item.key)] = item.value.value;
    });
    return JSON.stringify(result);
  }
  return '{}';
}
