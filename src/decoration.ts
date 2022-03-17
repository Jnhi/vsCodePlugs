import * as vscode from 'vscode';
import { locLangDic } from './extension';

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
        const regEx = /G_lang\(\"(.+?)\"/g;
        const text = activeEditor.document.getText();
        const smallNumbers: vscode.DecorationOptions[] = [];
        let match;

        while ((match = regEx.exec(text))) {
            var res = locLangDic.get(match[1])
            
            // console.log(" res : ",res,"key:",match[1]);

            var startIndex = match.index+8

            var startPos = activeEditor.document.positionAt(startIndex);
            
            var endPos = activeEditor.document.positionAt(startIndex + match[0].length);
            var decoration

            if (res){
                var tip:string = res[0]
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
                }
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
                }
            }
            smallNumbers.push(decoration);
        }
        activeEditor.setDecorations(this.smallNumberDecorationType, smallNumbers);

    }
}
