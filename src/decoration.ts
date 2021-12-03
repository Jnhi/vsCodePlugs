
import * as fs from 'fs';
import * as readline from 'readline';
import * as vscode from 'vscode';

/**
 * 文本装饰类
 */
export class Decoration {
    private langDic : Map<string,string> | undefined;
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
        // 更新本地化文本
        this.updateLangData()
        this.refreshDecoration();
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
        if (!this.langDic) {
            return;
        }
        //加了问号是非贪婪模式
        const regEx = /G_lang\(\"(.+?)\"/g;
        const text = activeEditor.document.getText();
        const smallNumbers: vscode.DecorationOptions[] = [];
        let match;

        while ((match = regEx.exec(text))) {
            var res = this.langDic.get(match[1])
            // console.log(" res : ",res,"key:",match[1]);
            var startPos = activeEditor.document.positionAt(match.index+8);
            var endPos = activeEditor.document.positionAt(match.index+8 + match[0].length);

            var decoration = { 
                range: new vscode.Range(startPos, endPos), 
                hoverMessage: res,
                renderOptions:{
                    before: {
                        "contentText":res,
                        "backgroundColor":"#7F7F7F11",
                        "color":"#D8D8D8FF",
                        // "fontWeight":"18",
                    }, 
                }
            }
            if (!res){
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

    /**
     * 更新语言文件Map
     */
    public updateLangData(){
        vscode.window.showInformationMessage('开始更新语言文件Map')
        if (this.langDic) {
            this.langDic.clear()
        }else{
            this.langDic = new Map()
        }
        var locPath = ""
        if (vscode.workspace.workspaceFolders) {
            const rootPath: string = vscode.workspace.workspaceFolders[0].uri.fsPath;
            console.log(vscode.workspace.workspaceFolders[0].uri.fsPath);
    
            var cocosIndex = rootPath.indexOf("cocosstudio")
            locPath = vscode.workspace.workspaceFolders[0].uri.fsPath + "\\language\\localText.lua";
            if(cocosIndex == -1){
                locPath = vscode.workspace.workspaceFolders[0].uri.fsPath + "\\cocosstudio\\language\\localText.lua";
            }
        }
    
        fs.stat(locPath, (err, stats) => {
            if (err != null) { 
                console.log(" err : " + err);
                return
            }
            var fRead = fs.createReadStream(locPath);
            var objReadline = readline.createInterface({
                input:fRead
            });
            objReadline.on('line', (line) => {
                
                // console.log("line|"+line);
                var key = line.match(/\[\"(.+)\"\]/);
                //x(?!y)称为先行否定断言（Negative look-ahead），x只有不在y前面才匹配，y不会被计入返回结果
                var value = line.match(/[= ]\"(.+)\"+/);
                console.log("line2|"+line);
                if (key) {
                    console.log("key:",key[1]);
                }
                if (value) {
                    console.log("value:"+"|"+value[1]);
                }
                if (key && value) {
                    if (this.langDic) {
                        // console.log("key:",key[1]);
                        // console.log("value:",value[1]);
                        this.langDic.set(key[1], value[1]);
                    }
                }
            });
        });
        vscode.window.showInformationMessage('更新语言文件Map成功')
    }

}
