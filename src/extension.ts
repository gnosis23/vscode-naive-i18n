import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let mockDict: Record<string, string> = {};

class Config {
	// get config from location
	static getConfigLocation() {
		return vscode.workspace.getConfiguration('n18n').get('location');
	}

	static setup() {
		let openDialogOptions: vscode.OpenDialogOptions = {
			canSelectFiles: true,
			canSelectFolders: false,
			canSelectMany: false,
			openLabel: 'Select'
		};

		vscode.window.showOpenDialog(openDialogOptions).then(fileUri => {
			if (fileUri && fileUri[0]) {
				let n18nConfiguration = vscode.workspace.getConfiguration('n18n');
			 	n18nConfiguration.update('location', path.normalize(fileUri[0].fsPath), true).then(() => {
					// prompt to reload window so storage location change can take effect
					vscode.window.showWarningMessage(
						`You must reload the window for the storage location change to take effect.`, 
						'Reload'
					).then(selectedAction => {
						// if the user selected to reload the window then reload
						if (selectedAction === 'Reload') {
							vscode.commands.executeCommand('workbench.action.reloadWindow');
						}
					});
				});
			}
		});
	}

	static readText() {
		let configLocation = String(Config.getConfigLocation());
		// ignore empty path
		if (!configLocation) { return; }

		// read files in location
		fs.readFile(String(configLocation), (err, buf) => {
			if (err) {
				console.error(err);
				// don't show warning
			} else {
				try {
					const content = JSON.parse(buf.toString());
					mockDict = content;
				} catch (err) {
					return vscode.window.showErrorMessage('Bad i18n JSON file, try to run `n18n: setup` again');
				}
			}
		});
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('naive-i18n is active.');

	// register commands
	let setupDisposable = vscode.commands.registerCommand('n18n.config', () => {
		Config.setup();
	});
	context.subscriptions.push(setupDisposable);

	// hover provider
	const provider1 = vscode.languages.registerHoverProvider('javascript', {

		provideHover(document, position, token) {
			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);

			if (mockDict[word]) {
				return new vscode.Hover(new vscode.MarkdownString(mockDict[word]));
			}
		}

	});

	context.subscriptions.push(provider1);

	// init
	Config.readText();
}

export function deactivate() { }
