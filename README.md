# Smart Paste

Smart Paste is a VS Code extension that automatically creates files with AI-generated names based on pasted content.

## Features

- Automatically creates a new file when you paste text into the folder structure
- Generates an intelligent filename based on the content using AI
- Seamlessly integrates with your workflow

## Installation

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X)
3. Search for "Smart Paste"
4. Click Install

## Setup

To use Smart Paste, you need to provide your OpenAI API key:

1. Open VS Code Settings (File > Preferences > Settings)
2. Search for "Smart Paste"
3. Enter your OpenAI API key in the "smartPaste.openAIKey" field
4. (Optional) If you're using a custom OpenAI API endpoint, enter the base URL in the "smartPaste.openAIBaseURL" field

## Usage

1. Copy any text content you want to save as a new file
2. In the VS Code file explorer, right-click on a folder where you want to paste
3. Select "Paste" or use the keyboard shortcut (Ctrl+V or Cmd+V)
4. Smart Paste will automatically create a new file with an AI-generated name based on the content

## Configuration

You can customize Smart Paste behavior in VS Code settings:

- `smartPaste.openAIKey`: Your OpenAI API key (required)
- `smartPaste.openAIBaseURL`: Base URL for the OpenAI API (optional, defaults to "https://api.openai.com/v1")
- `smartPaste.modelName`: Model name to use for generating file names (defaults to "gpt-4o-mini")
- `smartPaste.systemPrompt`: System prompt for the AI model (defaults to a file name generation prompt)

## Feedback and Contributions

We welcome your feedback and contributions! Please open an issue or submit a pull request on our [GitHub repository](https://github.com/KLaci/smart-paste).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/KLaci/smart-paste/LICENSE) file for details.
