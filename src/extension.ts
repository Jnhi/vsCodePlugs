// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Hover,languages,ExtensionContext,commands,StatusBarItem,window,StatusBarAlignment,workspace } from 'vscode';
import { basename } from 'path';
import { DownStateBar } from './downState';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed


export function activate(context: ExtensionContext) {

	let downStateBar = new DownStateBar();

	// let disposable = commands.registerCommand('helloworld.helloWorld', () => {
	// 	window.showInformationMessage('开启插件！');
	// });
	// context.subscriptions.push(disposable);

	const hover = languages.registerHoverProvider({ scheme: 'file', language: 'lua' },{

        provideHover(document, position, token) {
			console.log('测试悬停提示');
            const fileName = document.fileName;
            const word = document.getText(document.getWordRangeAtPosition(position));
            // if (/\/package\.json$/.test(fileName) && /\bmain\b/.test(word)) {
            //     return new vscode.Hover("测试悬停提示");
            // }
			return new Hover(word);
            // return undefined;
        }
    });

    context.subscriptions.push(hover);

	window.showInformationMessage('插件启动成功！')
}

function updateStatus(status: StatusBarItem): void {
    const info = getEditorInfo();
    status.text = "info ? info.text || '' : ''";
    status.tooltip = info ? info.tooltip : undefined;
    status.color = info ? info.color : undefined;
	status.show()
    // if (info) {
    //     status.show();
    // } else {
    //     status.hide();
    // }
}

function getEditorInfo(): { text?: string; tooltip?: string; color?: string; } | null {
    const editor = window.activeTextEditor;

    // If no workspace is opened or just a single folder, we return without any status label
    // because our extension only works when more than one folder is opened in a workspace.
    if (!editor || !workspace.workspaceFolders || workspace.workspaceFolders.length < 2) {
        return null;
    }

    let text: string | undefined;
    let tooltip: string | undefined;
    let color: string | undefined;

    // If we have a file:// resource we resolve the WorkspaceFolder this file is from and update
    // the status accordingly.
    const resource = editor.document.uri;
    if (resource.scheme === 'file') {
        const folder = workspace.getWorkspaceFolder(resource);
        if (!folder) {
            text = `$(alert) <outside workspace> → ${basename(resource.fsPath)}`;
        } else {
            text = `$(file-submodule) ${basename(folder.uri.fsPath)} (${folder.index + 1} of ${workspace.workspaceFolders.length}) → $(file-code) ${basename(resource.fsPath)}`;
            tooltip = resource.fsPath;

            const multiRootConfigForResource = workspace.getConfiguration('multiRootSample', resource);
            color = multiRootConfigForResource.get('statusColor');
        }
    }

    return { text, tooltip, color };
}
// this method is called when your extension is deactivated
export function deactivate() {}
