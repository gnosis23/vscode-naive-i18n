import * as assert from 'assert';
import { buildACAutoTree, search } from '../../acAuto';
import type { ACTreeNode } from '../../acAuto';

function traverseTree(root: ACTreeNode, result: string[]) {
  if (root.value) {
    result.push(root.value);
  } else {
    Object.keys(root.children).forEach(key => {
      traverseTree(root.children[key], result);
    });
  }
}

suite('AcAuto Test Suite', () => {
	test('build tree test', () => {
    let root = buildACAutoTree(['say', 'her', 'she', 'shy']);
		let leaves: string[] = [];
    traverseTree(root, leaves);
    assert.deepStrictEqual(
      leaves,
      ['say', 'she', 'shy', 'her']
    );
	});

  test('fail test', () => {
    let root = buildACAutoTree(['say', 'her', 'she', 'shy']);
    assert.equal(
      root.children['h'],
      root.children['s'].children['h'].fail
    );
    assert.equal(
      root.children['h'].children['e'],
      root.children['s'].children['h'].children['e'].fail
    );
	});

  test('fail test 2', () => {
    let root = buildACAutoTree(['s00s']);
    assert.equal(
      root.children['s'],
      root.children['s'].children['0'].children['0'].children['s'].fail
    );
	});

  test('search test', () => {
    let root = buildACAutoTree(['say', 'her', 'she', 'shy']);
    assert.deepStrictEqual(
      search('say her name, shyher', root),
      [{index: 0, str: 'say'}, {index: 4, str: 'her'}, {index: 14, str: 'shy'}, {index: 17, str: 'her'}]
    );
	});

  test('search test 2', () => {
    let root = buildACAutoTree(["'s20001'", "'s20002'"]);
    assert.deepStrictEqual(
      search("if (a === i18n('s20001') || a === i18n('s20002')) {}", root),
      [{ index: 15, str: "'s20001'" }, { index: 39, str: "'s20002'" }]
    );
	});

  test('search test 3', () => {
    let root = buildACAutoTree(["'s20001'", "(s20001)"]);
    assert.deepStrictEqual(
      search("if (a === i18n('s20001') || a === i18n('s20002')) {}", root),
      [{ index: 15, str: "'s20001'" }]
    );
	});
});
