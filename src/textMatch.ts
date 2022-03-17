import * as vscode from 'vscode';
import { locLangDicValue_Key,locPath } from './extension';
import path = require('path');

export class TextMatch {
    constructor(context: vscode.ExtensionContext) {
        console.log("TextMatch初始化")
    }
    
    /**
     * 替换文本
     */
    public replaceText() {

        const currentEditor = vscode.window.activeTextEditor
        if (!currentEditor) return
        //选择的字符串
        const currentSelect = currentEditor.document.getText(currentEditor.selection)
        if (!currentSelect) return
        // console.log("选择的字符串："+currentSelect)
        
        // currentEditor.selection.start.character
        //currentEditor.selection
        
        // var startIndex = currentEditor.selection.start.character - 1
        // var endIndex = currentEditor.selection.end.character + 1

        var startPos = currentEditor.selection.start.translate(undefined,-1)
        var endPos = currentEditor.selection.end.translate(undefined,1)
        // console.log("startIndex:"+startIndex)
        // console.log("endPos:"+endIndex)
        
        startPos.translate

        
        var res = locLangDicValue_Key.get(currentSelect)
        if (res) {
            currentEditor.edit(editBuilder => {
                editBuilder.replace(new vscode.Range(startPos, endPos),'G_lang("' + res +'")')
            })
        } else {
            vscode.window.showInformationMessage(`找不到需要文本😬`);
            // fs.promises.writeFile(locPath, finalLangContent,{ 'flag': 'a' });
            // var outView = vscode.window.createOutputChannel("文本")
            // outView.appendLine('["'+currentEditor.document.fileName+'"] = "' + currentSelect + '"')
            // outView.show()

            const edit = new vscode.WorkspaceEdit();
            // const edit = vscode.workspace.openTextDocument
            var uu = vscode.Uri.file(locPath)
            console.log(locPath)
            console.log(uu)
            
            var key = path.parse(currentEditor.document.fileName).name
            edit.insert(
                uu,
                new vscode.Position(8,0),
                '\t["'+ key + '_' + currentEditor.selection.anchor.line +'_'+ currentEditor.selection.anchor.character +'"] = "' + currentSelect + '",'
            );
            vscode.workspace.applyEdit(edit)
        }
    }
}
