import { once } from 'events';
import * as fs from 'fs';
import path = require('path');
import * as readline from 'readline';
import * as vscode from 'vscode';
import Conf from './conf';
import { Decoration } from './decoration';
import { Definition } from './definition';
import { DownStateBar } from './downState';
import { TextMatch } from './textMatch';

export const locLangDic : Map<string,string[]> = new Map() ;

export const locLangDicValue_Key : Map<string,string> = new Map() ;

var downStateBar:DownStateBar
export var locPath = ""
export async function activate(context: vscode.ExtensionContext) {
    // 下方状态栏
	downStateBar = new DownStateBar();
    console.log('状态栏启动成功！');
    //更新语言文本
    await updateLangData().then(function () {

        //替换文本
        let textMatch = new TextMatch(context);
        console.log('文本装饰启动成功！');

        // 文本装饰
        let decoration = new Decoration(context);
        console.log('文本装饰启动成功！');
        
        //代码跳转
        let definition = new Definition(context);
        console.log('代码跳转启动成功！');

        //注册一些快捷键方法
        context.subscriptions.push(vscode.commands.registerCommand('extension.changeText', async () => {
            textMatch.replaceText()
        }));
        context.subscriptions.push(vscode.commands.registerCommand('extension.updataLang', async () => {
            updateLangData().then(function () {
                console.log('更新结束');
            })
        }));

        //注册--当多语言文本被保存的时候触发
        vscode.workspace.onDidSaveTextDocument(async textDocument => {
            // console.log("多语言目录修改保存:onDidChangeTextEditorSelection 触发 ");
            console.log(textDocument.uri.fsPath);
            var regex = new RegExp(Conf.locLangExp);
            var isLocLangDir = regex.test(textDocument.uri.fsPath)
            if (isLocLangDir) {
                updateLangData().then(function () {
                    // console.log('插件外部结束');
                    decoration.refreshDecoration()
                })
            }
        });
        
        //悬停提示
        // let hoverTip = new HoverTip(context);

        //代码补全（其实没啥用 直接注释了）
        // let provider = new Provider(context);
        // console.log('代码补全启动成功！');

        console.log('插件启动成功！');
        downStateBar.setDownStateText('插件启动成功！')
        // vscode.window.showInformationMessage('插件启动成功！')
    })

}
/**
* 更新语言文件Map
*/
async function updateLangData(){
    // vscode.window.showInformationMessage('开始更新语言文件Map')
    if (downStateBar) {
	    downStateBar.setDownStateText('开始更新语言文件Map')
    }
    if (locLangDic) {
        locLangDic.clear()
    }
    if (vscode.workspace.workspaceFolders) {
        const rootPath: string = vscode.workspace.workspaceFolders[0].uri.fsPath;
        console.log(vscode.workspace.workspaceFolders[0].uri.fsPath);

        var cocosIndex = rootPath.indexOf("cocosstudio")
        locPath = vscode.workspace.workspaceFolders[0].uri.fsPath + "\\language\\localText.lua";
        console.log(vscode.workspace.workspaceFolders[0].uri)
        if(cocosIndex == -1){
            locPath = vscode.workspace.workspaceFolders[0].uri.fsPath + "\\cocosstudio\\language\\localText.lua";
        }
    }
    console.log(" locPath : " + locPath);


    var fRead = fs.createReadStream(locPath);
    var objReadline = readline.createInterface({
        input:fRead,
    });
    var lineIndex = 1
    objReadline.on('line', (line) => {
        
        // console.log("line|"+line);
        var key = line.match(/\[\"(.+)\"\]/);
        //x(?!y)称为先行否定断言（Negative look-ahead），x只有不在y前面才匹配，y不会被计入返回结果
        var value = line.match(/[= ]\"(.+)\"+/);
        // console.log("line2|"+line);
        // if (key) {
        //     console.log("key:",key[1]);
        // }
        // if (value) {
        //     console.log("value:"+"|"+value[1]);
        // }
        var string:string[] = new Array(4)
        if (key && value) {
            if (locLangDic) {
                var startIndex = line.indexOf(key[1]);
                var endIndex = startIndex + key[1].length;
                // console.log("startIndex:",startIndex);
                // console.log("endIndex:",endIndex);
                // console.log("key:",key[1]);
                // console.log("value:",value[1]);
                //[key,lineIndex]
                string[0] = value[1]
                string[1] = lineIndex.toString()
                string[2] = startIndex.toString()
                string[3] = endIndex.toString()
                string[4] = locPath
                // console.log("string:",string);
                locLangDic.set(key[1], string);
            }
            if (locLangDicValue_Key) {
                string[0] = value[1]
                locLangDicValue_Key.set(value[1],key[1]);
            }
        }
        lineIndex ++
    });
    objReadline.on('close', () => {
        if (downStateBar) {
            console.log("更新语言文件Map成功 内部");
            downStateBar.setDownStateText('更新语言文件Map成功')
        }
    });
    await once(objReadline, 'close');

}
// this method is called when your extension is deactivated
export function deactivate() {}
