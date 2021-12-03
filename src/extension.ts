// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext,window} from 'vscode';
import { Decoration } from './decoration';
import { DownStateBar } from './downState';
import { HoverTip } from './hoverTip';

export function activate(context: ExtensionContext) {
    //下方状态栏
	let downStateBar = new DownStateBar();
    // //悬停提示
    // let hoverTip = new HoverTip(context);
    //文本装饰
    let decoration = new Decoration(context);
    //注册一些快捷键方法
    context.subscriptions.push(commands.registerCommand('extension.updataLang', () => {
        // hoverTip.updateLangData()
        decoration.updateLangData()
    }));
    console.log('插件启动成功！');
	

	window.showInformationMessage('插件启动成功！')
}

// this method is called when your extension is deactivated
export function deactivate() {}
