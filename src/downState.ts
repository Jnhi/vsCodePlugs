
import { StatusBarItem,window,StatusBarAlignment } from 'vscode';

/**
 * 下方状态栏类
*/
export class DownStateBar {
    private _statusBar : StatusBarItem | undefined;
    /**
     * 状态栏对象
     */
    constructor() {
        if (!this._statusBar) {
            this._statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
        }
        this._statusBar.text = '$(octoface) ' + "无限进步";
    }
    
    /**
     * 展示文本
     */
    public setDownStateText(str:string) {

        if (!this._statusBar) {
            return;
        }
        // 获取当前活动编辑器
        let editor = window.activeTextEditor;

        // 如果不存在当前活动编辑器
        if(editor) {
            this._statusBar.text = '$(octoface) ' + str;
        }else{
            this._statusBar.text = '$(octoface) ' + "无限进步";
        }
        this._statusBar.show();

    }

    /**
     * 销毁对象
     */
    dispose() {
        if (this._statusBar) {
            this._statusBar.dispose();
        }
    }
}
