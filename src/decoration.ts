import * as vscode from 'vscode';
import { locJsonLangDic, locLangDic } from './extension';

/**
 * 文本装饰类
 */
export class Decoration {
    private smallNumberDecorationType = vscode.window.createTextEditorDecorationType({

        before: {
            "contentText":"res:",
            "backgroundColor":"#7F7F7F7F",
            "color":"#D8D8D87F",
        },
        overviewRulerLane: vscode.OverviewRulerLane.Right,
    });
    constructor(context: vscode.ExtensionContext) {
        this.refreshDecoration();
        
        vscode.window.onDidChangeTextEditorSelection(event => {
            // console.log("装饰器:onDidChangeTextEditorSelection 触发 ",event.textEditor.document);
            if (vscode.window.activeTextEditor && event.textEditor.document === vscode.window.activeTextEditor.document) {
                // console.log("装饰器:onDidChangeTextEditorSelection 触发2 ");
                this.refreshDecoration();
            }
        },this);
    
        vscode.workspace.onDidChangeTextDocument(event => {
            // console.log("装饰器:onDidChangeTextDocument 触发 ");
            if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
                // console.log("装饰器:onDidChangeTextDocument 触发2 ");
                this.refreshDecoration();
            }
        }, null, context.subscriptions);
    }

    /**
    * 创建文本装饰
    */ 
    public refreshDecoration(){
        let activeEditor = vscode.window.activeTextEditor;
        
        if (!activeEditor) {
            return;
        }
        if (!locLangDic) {
            return;
        }

        //加了问号是非贪婪模式
        const regEx1 = /G_lang\(\"(.+?)\"/g;
        
        const regEx2 = /tr\([\"\'](.+?)[\"\']/g;

        const regEx3 = /setText\(*.+\, ['"]+([^'"\r\n]+?)['"]+/g;

        const text = activeEditor.document.getText();
        const smallNumbers: vscode.DecorationOptions[] = [];
        let match;

        while ((match = regEx1.exec(text))) {
            var dic = locLangDic.get("localText");
            var res;
            if (dic) {
                res = dic.get(match[1]);
            }
            // console.log(" res : ",res,"key:",match[1]);

            var startIndex = match.index+8;

            var startPos = activeEditor.document.positionAt(startIndex);
            
            var endPos = activeEditor.document.positionAt(startIndex + match[0].length);
            var decoration;

            if (res){
                var tip:string = res[0];
                // console.log("startPos",startPos,"endPos",endPos,"tip",tip);
                decoration = { 
                    range: new vscode.Range(startPos, endPos), 
                    hoverMessage: tip,
                    renderOptions:{
                        before: {
                            "contentText":tip,
                            "backgroundColor":"#7F7F7F11",
                            "color":"#9C9C9BFF",
                            fontWeight:'normal',
                            fontStyle:'normal',
                        }, 
                    }
                };
            }else{
                decoration = { 
                    range: new vscode.Range(startPos, endPos), 
                    hoverMessage: " Undefined ",
                    renderOptions:{
                        before: {
                            "contentText":" Undefined ",
                            "backgroundColor":"#7F7F7F11",
                            "color":"#9C9C9BFF",
                            fontWeight:'normal',
                            fontStyle:'normal',
                        }, 
                    }
                };
            }
            smallNumbers.push(decoration);
        }

        while (match = regEx2.exec(text) ) {
            var str = match[0];
            var nameArr = match[1].split("@");
            // console.log(nameArr[0],nameArr[1]);
            var res2;
            if (nameArr.length>=2) {
                var jsonDic = locJsonLangDic.get(nameArr[0]);
                if (jsonDic) {
                    res2 = jsonDic[nameArr[1]];
                }
            }
            var start = match.index + str.lastIndexOf(nameArr[0]);
            var end = start + 1;

            var startPos = activeEditor.document.positionAt(start - 1);
            
            var endPos = activeEditor.document.positionAt(end + 1);
            var decoration;
            if (res2){
                var tip:string = res2;
                // console.log("startPos",startPos,"endPos",endPos,"tip",tip);
                decoration = { 
                    range: new vscode.Range(startPos, endPos), 
                    hoverMessage: tip,
                    renderOptions:{
                        before: {
                            "contentText":tip,
                            "backgroundColor":"#7F7F7F11",
                            "color":"#9C9C9BFF",
                            fontWeight:'normal',
                            fontStyle:'normal',
                        }, 
                    }
                };
            }else{
                decoration = { 
                    range: new vscode.Range(startPos, endPos), 
                    hoverMessage: " Undefined ",
                    renderOptions:{
                        before: {
                            "contentText":" Undefined ",
                            "backgroundColor":"#7F7F7F11",
                            "color":"#9C9C9BFF",
                            fontWeight:'normal',
                            fontStyle:'normal',
                        }, 
                    }
                };
            }
            smallNumbers.push(decoration);
        }

        while (match = regEx3.exec(text)) {
            var str = match[0];
            var nameArr = match[1].split("@");
            // console.log(nameArr[0],nameArr[1]);
            var res2;
            if (nameArr.length>=2) {
                var jsonDic = locJsonLangDic.get(nameArr[0]);
                if (jsonDic) {
                    res2 = jsonDic[nameArr[1]];
                }
            }
            var start = match.index + str.lastIndexOf(nameArr[0]);
            var end = start + 1;

            var startPos = activeEditor.document.positionAt(start - 1);
            
            var endPos = activeEditor.document.positionAt(end + 1);
            var decoration;
            if (res2){
                var tip:string = res2;
                // console.log("startPos",startPos,"endPos",endPos,"tip",tip);
                decoration = { 
                    range: new vscode.Range(startPos, endPos), 
                    hoverMessage: tip,
                    renderOptions:{
                        before: {
                            "contentText":tip,
                            "backgroundColor":"#7F7F7F11",
                            "color":"#9C9C9BFF",
                            fontWeight:'normal',
                            fontStyle:'normal',
                        }, 
                    }
                };
            }else{
                decoration = { 
                    range: new vscode.Range(startPos, endPos), 
                    hoverMessage: " Undefined ",
                    renderOptions:{
                        before: {
                            "contentText":" Undefined ",
                            "backgroundColor":"#7F7F7F11",
                            "color":"#9C9C9BFF",
                            fontWeight:'normal',
                            fontStyle:'normal',
                        }, 
                    }
                };
            }
            smallNumbers.push(decoration);
        }
        activeEditor.setDecorations(this.smallNumberDecorationType, smallNumbers);

    }
}
