import {
  window,
  workspace,
  ExtensionContext,
  MarkdownString,
  DecorationRangeBehavior,
  DecorationOptions,
  Range,
} from 'vscode';
import { search } from './acAuto';
import { CoreData } from './coreData';
import { log } from './log';
import { throttle } from './utils';

type RangeItem = {
  start: number;
  end: number;
  text: string;
};

function extractRanges(code: string, coreData: CoreData): RangeItem[] {
  const matches = search(code, coreData.acTree);
  return matches.map(x => {
    const str = x.str;
    return {
      start: x.index,
      end: x.index + str.length,
      text: coreData.getWord(str.slice(1, str.length - 1)),
    };
  });
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

      const rangeItems = extractRanges(code, coreData);
      // log.appendLine(JSON.stringify(rangeItems, null, 2));
      const ranges: DecorationOptions[] = rangeItems.map(item => ({
        range: new Range(doc.positionAt(item.start), doc.positionAt(item.end)),
        get hoverMessage() {
          return new MarkdownString(item.text);
        },
        renderOptions: {
          // after: {
          //   contentText: item.text,
          //   backgroundColor: '#999',
          //   color: '#fff',
          //   margin: '0 2px',
          // }
        },
      }));

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
