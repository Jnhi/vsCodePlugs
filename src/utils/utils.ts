import * as vscode from 'vscode';
import {TConf} from '../conf';

const Uri = vscode.Uri;
const Location = vscode.Location;
const Position = vscode.Position;

/** 返回多语言位置 */
export async function getWordLocation(key:string,document:vscode.TextDocument,locLangDic:Map<any,any>,conf:TConf){
  let re=[];

  const fileName = document.fileName;
  // const matchFolders = Object.keys(Dictionary)
  //   .filter(item=>(fileName.indexOf(item+'/')>-1))
  //   .sort((a,b)=>(b.length-a.length));
  // if(!matchFolders[0]) {return;};
  console.log("key:",key);
  try {
      var res = locLangDic.get(key)
      // console.log("res:",res);
      if(res){
        var uri =Uri.file(res[4])
        // console.log("uri:",uri);
        re.push(
          new Location(Uri.file(res[4]), new Position(Number(res[1])-1, Number(res[2])))
        );
      }
    // }

  } catch (error) {
    console.error(error);
  }

  return re;
}
/** 获取字符串在当前行位置范围 */
export function getRange(str:string,character:number,regExp:string){
  const re:{
    value:string,
    statrIndex:number,
    endIndex:number
  }[]=[];

  const regExpObj = getRegExp(regExp);
  if(!regExpObj) {return;};

  const _RegExp = new RegExp(regExpObj,"g");
	str.replace(_RegExp,($0:string,$1:string,$2:number)=>{
    re.push({
      value:$1,
      statrIndex:$2+$0.indexOf($1),
      endIndex:$2+$0.indexOf($1)+$1.length -1
    });
    return ''; 
  });

	if(!re.length){return;};
  const result = re.filter(({
    statrIndex,
    endIndex
  })=>{
    return (character>=statrIndex &&  character<=endIndex); 
  });

  if(result.length){
    return result[0];
  }
  return undefined;
}

/** 解析正则表达式 */
export function getRegExp(RegExpStr:string){
  if(/\\/.test(RegExpStr)){
    vscode.window.showInformationMessage("RegExp设置不支持\\反斜线");
    return;
  }

  if(!/\$1/.test(RegExpStr)){
    vscode.window.showInformationMessage("RegExp设置必须存在$1");
    return;
  }

  // 转译.()$
  let str=RegExpStr.replace(/([\.\(\)\$])/g,"\\$1");
  // 转译 '" 为 ['"]
  str=str.replace(/['"]/g,"['\"]");
  // 转译$1
  str=str.replace(/\\\$1/g,"([\\w-]+)");
  // 转译)$
  str=str.replace(/(\))$/,"$1?");

  try {
    new RegExp(str);
  } catch (error) {
    return;
  }
  return str;
}