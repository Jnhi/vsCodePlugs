import * as vscode from 'vscode';
import { getRange, getRegExp, getWordLocation } from './utils/utils';
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
            { scheme: 'file', language: 'lua' },
            this.DefinitionProvider,
        );
        context.subscriptions.push(registerDefinitionProvider);
    }
    /**
    * 自定义提示
    * @param {*} context ExtensionContext
    */
    private DefinitionProvider = <vscode.DefinitionProvider>{
        async provideDefinition(document:vscode.TextDocument, position:vscode.Position){
            const {character} = position;
        
            // 获取当前行内容
            let lineWord = document.lineAt(position).text;
            console.log("lineWord:",lineWord);
        
            // 匹配G_lang("xx"
            const getRangeRe = getRange(lineWord,character,Conf.regExp);
            console.log("getRangeRe:",getRangeRe);

            if(!getRangeRe) {return;}; 
            const {value} =getRangeRe;
            console.log("value:",value);
        
            if(!locLangDic) {return;}; 
            const location = await getWordLocation(value,document,locLangDic,Conf);
            if(!location) {return;};
        
            return location;
          }
    }


}