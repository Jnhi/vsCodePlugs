import * as vscode from 'vscode';
import { getRegExp } from './utils/utils';
import Conf from './conf';
import { locLangDic } from './extension';
    // "configuration": {
		// 	"title": "ClientTool配置",
		// 	"properties": {
		// 		"jnhi-plugin.regExp": {
		// 			"type": "string",
		// 			"default": "G_lang('$1')",
		// 			"description": "多语言匹配格式,$1为匹配符,必须存在"
		// 		}
		// 	}
		// },
export class Provider {
    /**
     * 自动提示类
     * @param {*} context ExtensionContext
     */
    constructor(context: vscode.ExtensionContext) {
        // 注册i18n代码补全
        var registerCompletionProvider = vscode.languages.registerCompletionItemProvider(
            { scheme: 'file', language: 'lua' },
            this.variableCompletionItemProvider,
            ...[`"`, `'`, `G_lang("")`,`G_lang('')`]
        );
        context.subscriptions.push(registerCompletionProvider);
        console.log("注册代码补全");
    }
    /**
    * 自定义提示
    * @param {*} context ExtensionContext
    */
    private variableCompletionItemProvider = <vscode.CompletionItemProvider>{

        provideCompletionItems:(document,position) => {

            // 匹配当前行内容
            const lineText = document.lineAt(position).text;
            const linePrefix = lineText.substr(0, position.character+1);
            console.log("linePrefix:",linePrefix);
            console.log("Conf.regExp:",Conf.regExp);
        
            let regExpObj = getRegExp(Conf.regExp);
            console.log("regExpObj:",regExpObj);

            if(!regExpObj) {return;};
            regExpObj=regExpObj.replace(/\(\[\\w-\]\+\)/,'');
            console.log("regExpObj:",regExpObj);
            if(!regExpObj) {return;};
            if(!(new RegExp(regExpObj).test(linePrefix))){
              return undefined;
            }
        
            // // 获取所有key值提示
            // if(!Dictionary) {return;}; 
            // const result = getLocalesKeys(document,Dictionary);
            // if(!result) {return;};
            // console.log("langDic:",this.langDic.keys());
            console.log("linePrefix2:",linePrefix);
            
            const result: vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> = []

            locLangDic.forEach((value, key) => { 
                result.push(new vscode.CompletionItem(key, vscode.CompletionItemKind.Variable))
            })
            // result.push
            // Object.keys(this.langDic.keys()).map(item=>{
            //     console.log("Map:",item);
            //     return new vscode.CompletionItem(item, vscode.CompletionItemKind.Variable);
            //   });
            return result; 
        },
        resolveCompletionItem() {
            console.log("resolveCompletionItem");
            return null;
        }
    }


}