import * as vscode from 'vscode';
import { getRange, getRegExp, getWordLocation, getWordLocationJson } from './utils/utils';
import Conf from './conf';
import { locLangDic } from './extension';

export class Definition {
    /**
     * 自动提示类
     * @param {*} context ExtensionContext
     */
    constructor(context: vscode.ExtensionContext) {
        // 注册语言跳转
        var registerDefinitionProvider = vscode.languages.registerDefinitionProvider(
            { scheme: 'file', language: 'lua'},
            this.definitionProvider,
        );
        context.subscriptions.push(registerDefinitionProvider);
        // 注册语言跳转
        var registerDefinitionProvider2 = vscode.languages.registerDefinitionProvider(
            { scheme: 'file', language: 'typescript'},
            this.definitionProvider,
        );
        context.subscriptions.push(registerDefinitionProvider2);
    }
    /**
    * 自定义提示
    * @param {*} context ExtensionContext
    */
    private definitionProvider = <vscode.DefinitionProvider>{
        async provideDefinition(document:vscode.TextDocument, position:vscode.Position){
            const {character} = position;
        
            // 获取当前行内容
            let lineWord = document.lineAt(position).text;
            // console.log("lineWord:",lineWord);
        
            // 匹配G_lang("xx"
            const getRangeRe1 = getRange(lineWord,character,Conf.regExp);
            const getRangeRe2 = getRange(lineWord,character,Conf.regExpTr);
            const getRangeRe3 = getRange(lineWord,character,Conf.regExpSt);

            if (getRangeRe1) {
                var matchStr = getRangeRe1.value;
                const location = await getWordLocation(matchStr,document,locLangDic,Conf);
                if(!location) {return;};
                return location;
            }else if (getRangeRe2) {
                var matchStr = getRangeRe2.value;
                const location = await getWordLocationJson(matchStr);
                if(!location) {return;};
                return location;
            }else if (getRangeRe3) {
                var matchStr = getRangeRe3.value;
                const location = await getWordLocationJson(matchStr);
                if(!location) {return;};
                return location;
            }
        
          }
    };


}