export type ACTreeNode = {
  ch: string;
  fail: ACTreeNode | null;
  value: string | null;
  parent: ACTreeNode | null;
  children: Record<string, ACTreeNode>;
};

export function createTreeNode(ch: string, parent: ACTreeNode | null): ACTreeNode {
  return { ch, fail: null, value: null, parent, children: {} };
}

export function buildACAutoTree(strs: string[]): ACTreeNode {
  const root = createTreeNode('/', null);

  function _buildTrie(node: ACTreeNode, str: string, index: number) {
    if (index === str.length) {
      node.value = str;
      return;
    }
    let ch = str[index];
    if (!node.children[ch]) {
      let next = createTreeNode(ch, node);
      node.children[ch] = next;
    }
    _buildTrie(node.children[ch], str, index + 1);
  }

  function _findFail(_root: ACTreeNode) {
    let queue: ACTreeNode[] = [_root];
    
    while (queue.length > 0) {
      let head = queue.shift() as ACTreeNode;

      // enqueue
      queue.push(...Object.values(head.children));

      let temp = head;
      while (temp !== _root) {
        let parent = temp.parent as ACTreeNode;
        if (parent === _root) {
          head.fail = _root;
          break;
        }

        let fail = parent.fail as ACTreeNode;
        if (fail.children[head.ch]) {
          head.fail = fail.children[head.ch];
          break;
        }
        temp = fail;
      }
      if (head.fail === null) { head.fail = _root; }
    }
  }

  strs.forEach(str => _buildTrie(root, str, 0));

  _findFail(root);

  return root;
}

export type WordSearchResult = { index: number, str: string };

export function search(code: string, root: ACTreeNode): WordSearchResult[] {
  let result: WordSearchResult[] = [];

  let temp = root;
  for (let i = 0; i < code.length; ++i) {
    let ch = code[i];
    do {
      if (temp.children[ch]) {
        temp = temp.children[ch];
        if (temp.value) {
          result.push({ index: i - temp.value.length + 1, str: temp.value });
          temp = temp.fail as ACTreeNode;
        }
        break;
      }
      temp = temp.fail as ACTreeNode;
    } while (temp !== root);
  }

  return result;
}