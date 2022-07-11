import * as assert from 'assert';
import * as vscode from 'vscode';
import { extractJson } from '../../utils';

suite('Utils Test Suite', () => {
	test('extract simple json test', () => {
		assert.strictEqual(extractJson(`export default {"s20001":"hello"}`), `{"s20001":"hello"}`);
    assert.strictEqual(extractJson(`export default {'s20001':'hello'}`), `{"s20001":"hello"}`);
	});

  test('extract escape json test', () => {
		assert.strictEqual(extractJson(`export default {"s20001\\"":"hello\\""}`), `{"s20001\\"":"hello\\""}`);
	});

  test('extract complex json test', () => {
		assert.strictEqual(
      extractJson(`export default {s20001:"hello",s20002:"world"}`),
      `{"s20001":"hello","s20002":"world"}`
    );
    assert.strictEqual(
      extractJson(`export default {s20001:'hello',s20002:'world'}`),
      `{"s20001":"hello","s20002":"world"}`
    );
	});

  test('extract strange json test', () => {
		assert.strictEqual(
      extractJson(`export default {s20001:"hello",s20002:"world: '123'"}`),
      `{"s20001":"hello","s20002":"world: '123'"}`
    );
    assert.strictEqual(
      extractJson(`export default {s20001:'hello',s20002:'world: \\'123\\''}`),
      `{"s20001":"hello","s20002":"world: '123'"}`
    );
	});
});
