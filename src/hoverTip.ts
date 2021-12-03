
import * as fs from 'fs';
import * as readline from 'readline';
import * as vscode from 'vscode';

// export class CustomCodeLensProvider implements vscode.CodeLensProvider {
// 	public provideCodeLenses(
// 		document: vscode.TextDocument
// 	): vscode.ProviderResult<vscode.CodeLens[]> {

//         // for (let index = 0; index < document.lineCount; index++) {
//         //     var lineTxt = document.lineAt(index).text;
//         //     lineTxt = lineTxt.replace(/ /g,'');
//         //     var keyWord = "G_lang"
//         //     var idx1 = lineTxt.indexOf(word);
//         //     console.log("lineTxt:",lineTxt.slice(idx1 - 8,idx1-2));
//         //     if(lineTxt.slice(idx1 - 8,idx1-2) == keyWord){
//         //         console.log("word:",word);
//         //         var res = this.langDic.get(word)
//         //         console.log("res:",res);
//         //         if (res){
//         //             tips = `${res}`;
//         //             return new vscode.Hover(tips);
//         //         }
//         //     }else{
//         //         return new vscode.Hover("");
//         //     }
//         // }

        

//         var codeLenses = [];
//         const regex = new RegExp(/G_lang\(\"(.+\")/g);
//         const text = document.getText();
//         let matches;
//         while ((matches = regex.exec(text)) !== null) {
//             const line = document.lineAt(document.positionAt(matches.index).line);
//             const indexOf = line.text.indexOf(matches[0]);
//             const position = new vscode.Position(line.lineNumber, indexOf);
//             const range = document.getWordRangeAtPosition(position, new RegExp(/G_lang\(\"(.+\")/g));
//             if (range) {
//                 codeLenses.push(new vscode.CodeLens(range));
//             }
//         }
//         return codeLenses;
// 	}
// }

/**
 * 自动提示类
 */
export class HoverTip {
    private langDic : Map<string,string> | undefined;

    constructor(context: vscode.ExtensionContext) {
        this.updateLangData()
        const hover = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'lua' },this.variableHoverProvider);
        context.subscriptions.push(hover);

        // const codelenprovider = new CustomCodeLensProvider();
        // vscode.languages.registerCodeLensProvider(
        //     { scheme: "file" },
        //     codelenprovider
        // );

    }

    /**
     * 自定义提示
     * @param {*} context ExtensionContext
     */
    private variableHoverProvider = <vscode.HoverProvider>{
        // this is for getting the values on hover over context variables and shortcuts
        provideHover: (document, position, token) => {
            var tips = "无语言Map"
            if (this.langDic == null) {
                return new vscode.Hover(tips);
            }
            var word = document.getText(document.getWordRangeAtPosition(position));
            var lineTxt = document.lineAt(position).text;
            lineTxt = lineTxt.replace(/ /g,'');
            var keyWord = "G_lang"
            var idx1 = lineTxt.indexOf(word);
            console.log("lineTxt:",lineTxt.slice(idx1 - 8,idx1-2));
            if(lineTxt.slice(idx1 - 8,idx1-2) == keyWord){
                console.log("word:",word);
                var res = this.langDic.get(word)
                console.log("res:",res);
                if (res){
                    tips = `${res}`;
                    return new vscode.Hover(tips);
                }
            }else{
                return new vscode.Hover("");
            }
        }
    };

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
                var key = line.match(/\[\"(.*)\"\]/);
                //x(?!y)称为先行否定断言（Negative look-ahead），x只有不在y前面才匹配，y不会被计入返回结果
                var value = line.match(/[= ]\".*\"+/);
                // console.log("line2|"+line);
                // if (key) {
                //     console.log("key:",key[1]);
                // }
                // if (value) {
                //     console.log("value:"+"|"+value[0]);
                // }
                if (key && value) {
                    if (this.langDic) {
                        // console.log("key:",key[1]);
                        // console.log("value:",value[0]);
                        this.langDic.set(key[1], value[0]);
                    }
                }
            });
        });
        vscode.window.showInformationMessage('更新语言文件Map成功')
    }

}
