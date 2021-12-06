// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as readline from 'readline';
import * as vscode from 'vscode';
import { Decoration } from './decoration';
import { Definition } from './definition';
import { DownStateBar } from './downState';
import { HoverTip } from './hoverTip';
import { Provider } from './provider';

export const locLangDic : Map<string,string[]> = new Map() ;

export function activate(context: vscode.ExtensionContext) {
    //更新语言文本
    updateLangData()
    // 下方状态栏
	let downStateBar = new DownStateBar();
    console.log('状态栏启动成功！');
    //悬停提示
    // let hoverTip = new HoverTip(context);
    // 文本装饰
    let decoration = new Decoration(context);
    console.log('文本装饰启动成功！');
    //代码补全
    let provider = new Provider(context);
    console.log('代码补全启动成功！');
    //代码跳转
    let definition = new Definition(context);
    console.log('代码跳转启动成功！');
    //注册一些快捷键方法
    context.subscriptions.push(vscode.commands.registerCommand('extension.updataLang', () => {
        // hoverTip.updateLangData()
        updateLangData()
    }));
    console.log('插件启动成功！');
	

	vscode.window.showInformationMessage('插件启动成功！')
}
/**
* 更新语言文件Map
*/
function updateLangData(){
    vscode.window.showInformationMessage('开始更新语言文件Map')
    if (locLangDic) {
        locLangDic.clear()
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
    console.log(" locPath : " + locPath);

    fs.stat(locPath, (err, stats) => {
        if (err != null) { 
            console.log(" err : " + err);
            return
        }
        var fRead = fs.createReadStream(locPath);
        var objReadline = readline.createInterface({
            input:fRead
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
            }
            lineIndex ++
        });
    });
    vscode.window.showInformationMessage('更新语言文件Map成功')
}
// this method is called when your extension is deactivated
export function deactivate() {}
