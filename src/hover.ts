import { ExtensionContext, window, MarkdownString, DecorationRangeBehavior, DecorationOptions, Range } from 'vscode';
import { CoreData } from './coreData';
import { log } from './log';

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
          log.appendLine('match: ' + match[0]);
          ranges.push({
            range: new Range(doc.positionAt(match.index), doc.positionAt(match.index + match[0].length)),
            get hoverMessage() {
              return new MarkdownString(coreData.codeTexts[key]);
            }
          });
          match = regex.exec(code);
        }
      });

      editor.setDecorations(underlineDecoration, ranges);
    } catch (err) {
      log.appendLine('Error on hover');
      log.appendLine(String(err));
    }

    function reset() {
      editor?.setDecorations(underlineDecoration, []);
    }
  }

  await updateHover();
}
