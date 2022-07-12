import { ACTreeNode, buildACAutoTree } from "./acAuto";
import { log } from "./log";

export class CoreData {
  codeTexts: Record<string, string>;
  acTree: ACTreeNode;
  listeners: ((...args: any[]) => any)[];

  constructor() {
    this.codeTexts = {};
    this.acTree = this._buildACTree([]);
    this.listeners = [];
  }

  setTexts(words: Record<string, string>) {
    this.codeTexts = words;
    let _words = Object.keys(words);
    this.acTree = this._buildACTree(_words);
  }

  getWord(str: string) {
    return this.codeTexts[str];
  }

  onReload(fn: (...args: any[]) => any) {
    this.listeners.push(fn);
  }

  reload() {
    try {
      this.listeners.forEach(fn => {
        fn.call(this);
      });
    } catch (err) { }
  }

  _buildACTree(words: string[]): ACTreeNode {
    log.appendLine('buildACTree');
    // log.appendLine(JSON.stringify(words));
    return buildACAutoTree(words);
  }
}
