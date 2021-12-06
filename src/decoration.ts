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
        // borderWidth: '1px',
        // borderStyle: 'solid',
        // overviewRulerColor: 'blue',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        // light: {
        //     // this color will be used in light color themes
        //     borderColor: 'darkblue'
        // },
        // dark: {
        //     // this color will be used in dark color themes
        //     borderColor: 'lightblue'
        // }
    });
    constructor(context: vscode.ExtensionContext) {
        console.log("装饰器1");
        this.refreshDecoration();
        console.log("装饰器2");

        // vscode.window.onDidChangeTextEditorSelection(editor => {
        //     vscode.window.activeTextEditor = editor;
        //     if (editor) {
        //         console.log("活动编辑器 更改时触发的事件");
        //         this.refreshDecoration();
        //     }
        // }, null, context.subscriptions);
        vscode.window.onDidChangeTextEditorSelection(event => {
            this.refreshDecoration()
        },this);
        console.log("装饰器3");
    
        vscode.workspace.onDidChangeTextDocument(event => {
            if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
                console.log("修改文本");
                this.refreshDecoration();
            }
        }, null, context.subscriptions);
    }

    /**
    * 创建文本装饰
    */ 
    private refreshDecoration(){
        let activeEditor = vscode.window.activeTextEditor;
        
        if (!activeEditor) {
            return;
        }
        if (!locLangDic) {
            return;
        }
        console.log("装饰器4");

        //加了问号是非贪婪模式
        const regEx = /G_lang\(\"(.+?)\"/g;
        const text = activeEditor.document.getText();
        const smallNumbers: vscode.DecorationOptions[] = [];
        let match;
        console.log("装饰器5");

        while ((match = regEx.exec(text))) {
            // console.log("装饰器6",match);
            var res = locLangDic.get(match[1])
            console.log(" res : ",res,"key:",match[1]);
            var startPos = activeEditor.document.positionAt(match.index+8);
            var endPos = activeEditor.document.positionAt(match.index+8 + match[0].length);
            var decoration

            if (res){
                var tip:string = res[0]
                decoration = { 
                    range: new vscode.Range(startPos, endPos), 
                    hoverMessage: tip,
                    renderOptions:{
                        before: {
                            "contentText":tip,
                            "backgroundColor":"#7F7F7F11",
                            "color":"#D8D8D8FF",
                            // "fontWeight":"18",
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
                            "color":"#FF0000FF",
                            // "fontWeight":"18",
                        }, 
                    }
                }
            }
            smallNumbers.push(decoration);
        }
        activeEditor.setDecorations(this.smallNumberDecorationType, smallNumbers);

    }
}
