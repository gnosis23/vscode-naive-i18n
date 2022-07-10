import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { log } from './log';
import { CoreData } from './coreData';

export class ConfigLoader {
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

		return vscode.window.showOpenDialog(openDialogOptions).then(fileUri => {
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
            const content = JSON.parse(buf.toString());
            data.setTexts(content);
          } catch (err) {
            return vscode.window.showErrorMessage('Bad i18n JSON file, try to run `n18n: setup` again');
          }
        }
        resolve(1);
      });
    });
	}
}