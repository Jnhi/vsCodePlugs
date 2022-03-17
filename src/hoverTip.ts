import * as vscode from 'vscode';
import { locLangDic } from './extension';

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
    constructor(context: vscode.ExtensionContext) {
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

        provideHover: (document, position, token) => {
            console.log("进来了provideHover");
            var tips = "无语言Map"
            if (locLangDic == null) {
                return new vscode.Hover(tips);
            }
            var word = document.getText(document.getWordRangeAtPosition(position));
            var lineTxt = document.lineAt(position).text;
            lineTxt = lineTxt.replace(/ /g,'');
            var keyWord = "G_lang"
            var idx1 = lineTxt.indexOf(word);
            // console.log("lineTxt:",lineTxt.slice(idx1 - 8,idx1-2));
            if(lineTxt.slice(idx1 - 8,idx1-2) == keyWord){
                // console.log("word:",word);
                var res = locLangDic.get(word)
                // console.log("res:",res);
                if (res){
                    tips = `${res[0]}`;
                    return new vscode.Hover(tips);
                }
            }else{
                return new vscode.Hover("");
            }
        }
    };

}
