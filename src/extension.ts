import * as vscode from 'vscode';

const mockDict: Record<string, string> = {
	's20001': '我',
	's20002': '是',
	's20003': '超',
	's20004': '微',
	's20005': '蓝',
	's20006': '猫',
};

export function activate(context: vscode.ExtensionContext) {
	const provider1 = vscode.languages.registerHoverProvider('javascript', {

		provideHover(document, position, token) {
			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);

			if (word === "HELLO") {
				return new vscode.Hover(new vscode.MarkdownString('this is HELLO'));
			}
			if (mockDict[word]) {
				return new vscode.Hover(new vscode.MarkdownString(mockDict[word]));
			}
		}

	});

	context.subscriptions.push(provider1);
}

export function deactivate() { }
