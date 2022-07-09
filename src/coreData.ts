export class CoreData {
  codeTexts: Record<string, string>;

  constructor() {
    this.codeTexts = {};
  }

  setTexts(words: Record<string, string>) {
    this.codeTexts = words;
  }

  getWord(str: string) {
    return this.codeTexts[str];
  }
}
