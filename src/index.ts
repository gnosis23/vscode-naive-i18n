import * as vscode from 'vscode';
import { log } from './log';
import { ConfigLoader } from './configLoader';
import { CoreData } from './coreData';
import { registerHover } from './hover';

let coreData: CoreData = new CoreData();

export async function activate(context: vscode.ExtensionContext) {
	log.appendLine('[info] naive-i18n is active.');

	// register commands
	let setupDisposable = vscode.commands.registerCommand('n18n.config', () => {
		ConfigLoader.setup();
	});
	context.subscriptions.push(setupDisposable);
	
	// init
	await ConfigLoader.readText(coreData);

	await registerHover(context, coreData);
}

export function deactivate() { }
