/* eslint-disable @typescript-eslint/naming-convention */
import path = require('path');
import * as vscode from 'vscode';
import {TConf} from '../conf';
import { locJsonLangDic,locJsonPath } from '../extension';
import * as fs from 'fs';

const Uri = vscode.Uri;
const Location = vscode.Location;
const Position = vscode.Position;

/** 返回多语言位置localTable */
export async function getWordLocation(key:string,document:vscode.TextDocument,locLangDic:Map<any,any>,conf:TConf){
  let re=[];

  // console.log("key:",key);
  try {
      var dic = locLangDic.get("localText");
      var res = dic.get(key);
      // console.log("res:",res);
      if(res){
        var uri =Uri.file(res[4]);
        // console.log("uri:",uri);
        re.push(
          new Location(Uri.file(res[4]), new Position(Number(res[1])-1, Number(res[2])))
        );
      }
  } catch (error) {
    console.error(error);
  }
  return re;
}

/** 返回多语言位置json */
export async function getWordLocationJson(key:string){
  let re=[];
  try {
    var nameArr = key.split("@");
    console.log("nameArr:"+nameArr);
    let jsonObj = locJsonLangDic.get(nameArr[0]);
    if(jsonObj){
      var uri =Uri.file(path.join(locJsonPath,`locale_${nameArr[0]}.json`));
      // json文件判断文件跳转到第几行有点麻烦 不在额外处理了
      re.push(
        new Location(uri, new Position(1, 1))
      );
    }
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
  console.log(regExpObj)
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
  console.log(re)
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
  // if(/\\/.test(RegExpStr)){
  //   vscode.window.showInformationMessage("RegExp设置不支持\\反斜线");
  //   return;
  // }

  // if(!/\$1/.test(RegExpStr)){
  //   vscode.window.showInformationMessage("RegExp设置必须存在$1");
  //   return;
  // }

  // 转译.()$
  let str=RegExpStr.replace(/([\(\)\$])/g,"\\$1");
  // 转译 '" 为 ['"]
  // str=str.replace(/['"]/g,"['\"]");
  // 转译$1
  str = str.replace(/\\\$1/g,"(.+?)");
  // 转译)$
  // str=str.replace(/(\))$/,"$1?");

  // let str = RegExpStr.replace(/\\\$1/g,"(.+?)");

  try {
    new RegExp(str);
  } catch (error) {
    return;
  }
  return str;
}

/** 获取元素在数组中的下标 */
export function search (nums: string[], target: string) {
  var left = 0, right = nums.length - 1;
  while (left <= right) {
      var mid = (left + right) >> 1;
      if (nums[mid] > target) {
          right = mid - 1;
      }
      if (nums[mid] === target) {return mid;}
      if (nums[mid] < target) {
          left = mid + 1;
      }
  }
  return -1;
}
