const path = require('path');
const fs = require('fs');
const vscode = require('vscode');
const { generateText } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');

const MAX_LENGTH = 2000;

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

	// Access your custom options
	const apiKey = config.get('openAIKey');
	const baseURL = config.get('openAIBaseURL');
	const modelName = config.get('modelName');
	const systemPrompt = config.get('systemPrompt');

	if (!apiKey) {
		vscode.window.showErrorMessage('OpenAI API key not found. Please add it to the settings.');
		return;
	}

	let openaiConfig = { apiKey, compatibility: 'strict' };

	if (baseURL && baseURL !== 'https://api.openai.com/v1') {
		openaiConfig.baseURL = baseURL;
		openaiConfig.compatibility = 'compatible';
	}

	const openai = createOpenAI(openaiConfig);

	const { text } = await generateText({
		model: openai(modelName),
		system: systemPrompt,
		prompt: `Code snippet:
${clipboardText.length > MAX_LENGTH ? clipboardText.slice(0, MAX_LENGTH) + '...' : clipboardText}`,
	});

	return text;
}


function getCurrentFolder() {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const filePath = editor.document.uri.fsPath;

		vscode.window.showInformationMessage(`Current file path: ${filePath}`);

		// Check if the filePath is within the workspace folders
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (workspaceFolders && workspaceFolders.length > 0) {
			for (const folder of workspaceFolders) {
				if (filePath.startsWith(folder.uri.fsPath)) {
					const folderPath = getFolderFromPath(filePath);
					console.log('Current folder path:', folderPath);
					return folderPath;
				}
			}
		}

		// Fallback to the first workspace folder if the file is not within any workspace folder
		const fallbackFolderPath = workspaceFolders[0].uri.fsPath;
		return fallbackFolderPath;
	} else {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders && workspaceFolders.length > 0) {
			const folderPath = workspaceFolders[0].uri.fsPath;
			console.log('Current folder path:', folderPath);
			return folderPath;
		} else {
			vscode.window.showErrorMessage('No workspace folder found.');
		}
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context) {   // Register a command to override the default paste command
	const disposable = vscode.commands.registerCommand('smartPaste.customPaste', async () => {
		const folderPath = getCurrentFolder();

		if (folderPath) {
			// Execute the default paste command
			await vscode.commands.executeCommand('editor.action.clipboardPasteAction');

			const clipboardText = await vscode.env.clipboard.readText();
			if (!clipboardText) {
				vscode.window.showErrorMessage('No text in the clipboard.');
				return;
			}


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
