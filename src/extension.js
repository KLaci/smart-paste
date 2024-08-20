const path = require('path');
const fs = require('fs');
const vscode = require('vscode');
const { generateText } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');

function getFolderFromPath(filePath) {
	try {
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			return filePath;
		} else if (stats.isFile()) {
			return path.dirname(filePath);
		} else {
			throw new Error('Path is neither a file nor a directory');
		}
	} catch (err) {
		throw err;
	}
}

async function generateFileNameWithOpenAI(clipboardText) {
	const config = vscode.workspace.getConfiguration('smartPaste');

	// Access your custom option
	const apiKey = config.get('openAIKey');

	if (!apiKey) {
		vscode.window.showErrorMessage('OpenAI API key not found. Please add it to the settings.');
		return;
	}

	const openai = createOpenAI({
		apiKey
	});


	const { text } = await generateText({
		model: openai('gpt-4o-mini'),
		system: `You are a code file name generator. You receive the content of the file. 
Only return with the suggested file name, no explanation.`,
		prompt: `Code snippet:
${clipboardText}`,
	});

	return text;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context) {   // Register a command to override the default paste command
	const disposable = vscode.commands.registerCommand('smartPaste.customPaste', async () => {

		const editor = vscode.window.activeTextEditor;

		if (editor) {
			// Execute the default paste command
			await vscode.commands.executeCommand('editor.action.clipboardPasteAction');

			const clipboardText = await vscode.env.clipboard.readText();
			if (!clipboardText) {
				vscode.window.showErrorMessage('No text in the clipboard.');
				return;
			}

			const folderPath = getFolderFromPath(editor.document.uri.fsPath);

			const fileName = await generateFileNameWithOpenAI(clipboardText);
			let filePath = path.join(folderPath, fileName);

			let i = 0;
			while (fs.existsSync(filePath)) {
				i++;

				const ext = path.extname(fileName);
				const name = path.basename(fileName, ext);
				filePath = path.join(folderPath, `${name} (${i})${ext}`);
			}

			try {
				await fs.promises.writeFile(filePath, clipboardText);
				vscode.window.showInformationMessage(`File '${fileName}' created.`);
				const document = await vscode.workspace.openTextDocument(filePath);
				await vscode.window.showTextDocument(document);

				await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(filePath));
				await vscode.commands.executeCommand('renameFile', vscode.Uri.file(filePath));
			} catch (error) {
				vscode.window.showErrorMessage(`Error creating file: ${error}`);
			}
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
