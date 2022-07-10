import { log } from './log';

/**
 * a naive way to extract the default exported js object to json string
 * eg: 
 *   export default { "s00001": "hello" }
 *   to
 *   { "s00001": "hello" } 
 * @param {string} code JavaScript code 
 * @returns {string} json string
 */
export function extractJson(code: string): string {
  let text = /export\s*default\s*(\{(.|\r|\n)*\})/;
  let match = code.match(text);
  if (match) {
    let text = match[1];
    text = text.replace(/'(.*)'/g, `"$1"`);
    log.appendLine(text);
    return text;
  }
  return '{}';
}
