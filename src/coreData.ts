export class CoreData {
  codeTexts: Record<string, string>;
  listeners: ((...args: any[]) => any)[];

  constructor() {
    this.codeTexts = {};
    this.listeners = [];
  }

  setTexts(words: Record<string, string>) {
    this.codeTexts = words;
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
    } catch (err) {}
  }
}
