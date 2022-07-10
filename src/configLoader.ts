import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { log } from './log';
import { CoreData } from './coreData';
import { extractJson } from './utils';

export class ConfigLoader {
	// get config from location
	static getConfigLocation() {
		if (vscode.workspace.workspaceFolders) {
			return vscode.workspace.getConfiguration(
				'n18n',
				vscode.workspace.workspaceFolders[0]
			).get('location');
		}
		return '';
	}

	static async setup() {
		let openDialogOptions: vscode.OpenDialogOptions = {
			canSelectFiles: true,
			canSelectFolders: false,
			canSelectMany: false,
			openLabel: 'Select',
			/* eslint-disable */
			filters: {
				"JSON": ['json'],
				"JavaScript": ['js'],
			}
			/* eslint-enable */
		};

		const fileUri = await vscode.window.showOpenDialog(openDialogOptions);
		if (fileUri && fileUri[0]) {
			let workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) {
				const folder = await vscode.window.showWorkspaceFolderPick({
					placeHolder: 'Pick Workspace Folder to which this setting should be applied',
				});
				if (!folder) { return; }
				workspaceFolders = [folder];
			}

			let n18nConfiguration = vscode.workspace.getConfiguration('n18n', workspaceFolders[0]);
			await n18nConfiguration.update(
				'location',
				path.normalize(fileUri[0].fsPath),
				vscode.ConfigurationTarget.Workspace,
				true
			);

			// prompt to reload window so storage location change can take effect
			const selectedAction = await vscode.window.showWarningMessage(
				`You must reload the window for the storage location change to take effect.`,
				'Reload'
			);

			// if the user selected to reload the window then reload
			if (selectedAction === 'Reload') {
				vscode.commands.executeCommand('workbench.action.reloadWindow');
			};
		}
	}

	static reload(data: CoreData) {
		let configLocation = String(ConfigLoader.getConfigLocation());
		// ignore empty path
		if (!configLocation) { return; }

		// read files in location
		return new Promise((resolve) => {
			fs.readFile(String(configLocation), (err, buf) => {
				if (err) {
					log.appendLine(err.toString());
					// don't show warning
				} else {
					try {
						const isJson = configLocation.endsWith('.json');
						const content = isJson ? JSON.parse(buf.toString()) : JSON.parse(extractJson(buf.toString()));
						data.setTexts(content);
					} catch (err) {
						vscode.window.showErrorMessage('Bad i18n JSON file, try to run `n18n: setup` again');
					}
				}
				resolve(1);
			});
		});
	}
}