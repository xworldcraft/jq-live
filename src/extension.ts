// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import showPreview from './jq/previewer';
import { JQProvider } from './provider/jqprovider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const queries = new WeakMap<vscode.Uri, string>();
  const histories = new WeakMap<vscode.Uri, vscode.QuickPickItem[]>();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jq-live" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('jq-live.jq', showPreview(queries, histories));

	// content provider
	const jqProvider = new JQProvider();
	let jqdisposable = vscode.workspace.registerTextDocumentContentProvider("jq", jqProvider);

	let savedocdisposable = vscode.workspace.onDidSaveTextDocument((document) => {
		if (!queries.has(document.uri)) {
			return;
		}
		vscode.commands.executeCommand("jq-live.jq", document.uri);
	});
	let closedocdisposable = vscode.workspace.onDidCloseTextDocument((document) => {
		queries.delete(document.uri);
	});

	context.subscriptions.push(
		disposable, 
		jqdisposable,
		savedocdisposable,
		closedocdisposable
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
