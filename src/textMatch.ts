import * as vscode from 'vscode';
import { locJsonLangDic,locPath } from './extension';
import path = require('path');

export class TextMatch {
    constructor(context: vscode.ExtensionContext) {
        console.log("TextMatch初始化");
    }
    
    /**
     * 替换文本
     */
    public replaceText() {

        const currentEditor = vscode.window.activeTextEditor;
        if (!currentEditor) {return;};
        //选择的字符串
        const currentSelect = currentEditor.document.getText(currentEditor.selection);
        if (!currentSelect) {return;};

        var startPos = currentEditor.selection.start.translate(undefined,-1);
        var endPos = currentEditor.selection.end.translate(undefined,1);


        vscode.window.showInformationMessage(`😬暂停使用`);

        // var res = locLangDicValue_Key.get(currentSelect);
        // if (res) {
        //     currentEditor.edit(editBuilder => {
        //         editBuilder.replace(new vscode.Range(startPos, endPos),'G_lang("' + res +'")');
        //     });
        // } else {
        //     vscode.window.showInformationMessage(`找不到😬已经自动生成对应文本`);

        //     const edit = new vscode.WorkspaceEdit();

        //     var key = path.parse(currentEditor.document.fileName).name;
        //     edit.insert(
        //         vscode.Uri.file(locPath),
        //         new vscode.Position(8,0),
        //         '\n\t["'+ key + '_' + currentEditor.selection.anchor.line +'_'+ currentEditor.selection.anchor.character +'"] = "' + currentSelect + '",'
        //     );

        //     vscode.workspace.saveAll(false);
        // } 
    }
}
