import { once } from 'events';
import path = require('path');
import * as readline from 'readline';
import * as vscode from 'vscode';
import * as fs from 'fs';
import Conf from './conf';
import { Decoration } from './decoration';
import { Definition } from './definition';
import { DownStateBar } from './downState';
import { TextMatch } from './textMatch';

export const locLangDic : Map<string,Map<string,string[]>> = new Map() ;
export const locJsonLangDic : Map<string,any> = new Map() ;

var downStateBar:DownStateBar;
export var locPath = "";
export var locJsonPath = "";
export async function activate(context: vscode.ExtensionContext) {
    // 下方状态栏
	downStateBar = new DownStateBar();
    console.log('状态栏启动成功！');
    //更新语言文本
    await updateLangData().then(function () {

        //替换文本
        let textMatch = new TextMatch(context);
        console.log('替换文本启动成功！');

        // 文本装饰
        let decoration = new Decoration(context);
        console.log('文本装饰启动成功！');
        
        //代码跳转
        let definition = new Definition(context);
        console.log('代码跳转启动成功！');

        //注册一些快捷键方法
        context.subscriptions.push(vscode.commands.registerCommand('extension.changeText', async () => {
            textMatch.replaceText();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('extension.updataLang', async () => {
            updateLangData().then(function () {
                console.log('更新结束');
            });
        }));

        //注册--当多语言文本被保存的时候触发
        vscode.workspace.onDidSaveTextDocument(async textDocument => {
            // console.log("多语言目录修改保存:onDidChangeTextEditorSelection 触发 ");
            // console.log(textDocument.uri.fsPath);
            var regex = new RegExp(Conf.locLangExp);
            var isLocLangDir = regex.test(textDocument.uri.fsPath);
            if (isLocLangDir) {
                updateLangData().then(function () {
                    // console.log('插件外部结束');
                    decoration.refreshDecoration();
                });
            }
        });
        console.log('插件启动成功！');
        downStateBar.setDownStateText('插件启动成功！');
        
        //没啥用 直接注释了
        //悬停提示
        // let hoverTip = new HoverTip(context);

        //代码补全
        // let provider = new Provider(context);
        // console.log('代码补全启动成功！');
    });

}
/**
* 更新语言文件Map
*/
async function updateLangData(){
    console.log('开始更新语言文件Map');
    if (downStateBar) {
	    downStateBar.setDownStateText('开始更新语言文件Map');
    }
    if (locLangDic) {
        locLangDic.clear();
    }
    if (vscode.workspace.workspaceFolders) {
        // console.log(vscode.workspace.workspaceFolders[0].uri.fsPath);
        //json文件路径
        locJsonPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath,Conf.trDir);
        //localText文件路径
        locPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath,Conf.localTextPath);
    }

    fs.access(locPath, async (err) => {
        if (err) {
            console.log(err.message);
        } else {
            var fRead = fs.createReadStream(locPath);
            var objReadline = readline.createInterface({
                input:fRead,
            });
            var lineIndex = 1;
        
            var localTextDic = new Map();
            objReadline.on('line', (line) => {
        
                var key = line.match(/\[\"(.+)\"\]/);
                var value = line.match(/[= ]\"(.+)\"+/);
                var string:string[] = new Array(4);
                if (key && value) {
                    if (locLangDic) {
        
                        var startIndex = line.indexOf(key[1]);
                        var endIndex = startIndex + key[1].length;
                        // console.log("startIndex:",startIndex);
                        // console.log("endIndex:",endIndex);
                        // console.log("key:",key[1]);
                        // console.log("value:",value[1]);
                        string[0] = value[1];
                        string[1] = lineIndex.toString();
                        string[2] = startIndex.toString();
                        string[3] = endIndex.toString();
                        string[4] = locPath;
                        // console.log("string:",string);
                        localTextDic.set(key[1], string);
                    }
                }
                lineIndex ++;
            });
            objReadline.on('close', () => {
        
                locLangDic.set("localText", localTextDic);
        
                if (downStateBar) {
                    console.log("更新localText语言文件Map成功");
                    downStateBar.setDownStateText('更新localText语言文件Map成功');
                }
            });
        
        
            await once(objReadline, 'close');
        }
    });
    fs.access(locJsonPath, async (err) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log("加载json");
            // console.log("json文件目录："+locJsonPath);
        
            let dirs = fs.readdirSync(locJsonPath);
            // console.log("json文件："+dirs);
            const arr = dirs.filter((d) => d.indexOf('locale_') > -1);
            for (const v of arr) {
                const filename = v.replace(/locale_([^\.\_]+).*$/gi, '$1');
                let content = fs.readFileSync(path.join(locJsonPath,v)).toString('utf-8');
                let jsonObj = JSON.parse(content);
                locJsonLangDic.set(filename, jsonObj);
            }
            console.log("json文件加载完成");
        }
    });
}
// this method is called when your extension is deactivated
export function deactivate() {}
