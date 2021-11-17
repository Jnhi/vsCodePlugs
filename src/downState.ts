
import { Hover,languages,ExtensionContext,commands,StatusBarItem,window,StatusBarAlignment,workspace } from 'vscode';


export class DownStateBar {
	//定义一个状态栏的属性
    private _statusBar : StatusBarItem | undefined;
    constructor() {
        if (!this._statusBar) {
            this._statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
        }
        this._statusBar.text = '$(octoface) ' + "无限进步";

        // 当编辑器中的选择更改时触发的事件
        window.onDidChangeTextEditorSelection(this.updateWordCount,this);

        // 当活动编辑器 发生更改时将触发的事件
        window.onDidChangeActiveTextEditor(this.updateWordCount, this);
    }

    public updateWordCount() {

        if (!this._statusBar) {
            return
        }
        // 获取当前活动编辑器
        let editor = window.activeTextEditor;

        // 如果不存在当前活动编辑器
        if(!editor) {
            this._statusBar.text = '$(octoface) ' + "修仙ing";
            return
        }

        // 获取当前文档的全部信息
        let doc = editor.document;

        // 用来读取当前文件的语言 ID，判断是否是 md 文档
        if(doc.languageId === 'lua') {
            let textNum = doc.getText().replace(/[\r\n\s]+/g, '').length;
            this._statusBar.text = textNum === 0 ? `目前还没有文字～` : `$(octoface)已经输出 ${textNum} 个字啦！！！`;
            this._statusBar.show();
        } else {
            this._statusBar.text = '$(octoface) ' + "无限进步";
        }
    }

    // 销毁对象和自由资源
    dispose() {
        if (this._statusBar) {
            this._statusBar.dispose();
        }
    }
}
