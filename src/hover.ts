import {
  window,
  workspace,
  ExtensionContext,
  MarkdownString,
  DecorationRangeBehavior,
  DecorationOptions,
  Range,
} from 'vscode';
import { CoreData } from './coreData';
import { log } from './log';

export function throttle<T extends ((...args: any) => any)>(func: T, timeFrame: number): T {
  let lastTime = 0;
  let timer: any;
  return function () {
    const now = Date.now();
    clearTimeout(timer);
    if (now - lastTime >= timeFrame) {
      lastTime = now;
      return func();
    }
    else {
      timer = setTimeout(func, timeFrame);
    }
  } as T;
}


export async function registerHover(context: ExtensionContext, coreData: CoreData) {
  const underlineDecoration = window.createTextEditorDecorationType({
    textDecoration: 'none; border-bottom: 1px dashed currentColor',
    rangeBehavior: DecorationRangeBehavior.ClosedClosed,
  });

  async function updateHover(editor = window.activeTextEditor) {
    try {
      const doc = editor?.document;
      if (!doc) { return reset(); }

      const code = doc.getText();
      if (!code) { return reset(); }

      const ranges: DecorationOptions[] = [];

      // FIXME: overlap
      Object.keys(coreData.codeTexts).forEach(key => {
        // find all text literals, like "s20001"
        let regex = RegExp(`('${key}'|"${key}")`, 'g');
        let match = regex.exec(code);
        while (match) {
          ranges.push({
            range: new Range(doc.positionAt(match.index), doc.positionAt(match.index + match[0].length)),
            get hoverMessage() {
              return new MarkdownString(coreData.codeTexts[key]);
            },
            renderOptions: {
              after: {
                contentText: coreData.getWord(key),
                backgroundColor: '#999',
                color: '#fff',
                margin: '0 2px',
              }
            },
          });
          match = regex.exec(code);
        }
      });

      editor.setDecorations(underlineDecoration, ranges);
    } catch (err) {
      log.appendLine('Error on hover');
      log.appendLine(String(err));
    }

    const throttledUpdate = throttle(updateHover, 500);

    window.onDidChangeActiveTextEditor(throttledUpdate);
    workspace.onDidChangeTextDocument(e => {
      if (e.document === window.activeTextEditor?.document) {
        throttledUpdate();
      }
    });
    coreData.onReload(updateHover);

    function reset() {
      editor?.setDecorations(underlineDecoration, []);
    }
  }

  await updateHover();
}
