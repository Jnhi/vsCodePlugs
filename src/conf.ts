import * as vscode from 'vscode';
const configuration = vscode.workspace.getConfiguration();

/** 配置 */
export interface TConf {
  /** 多语言文本目录匹配字符串 */
  locLangExp:string,
  /** G_lang匹配格式 */
  regExp:string,
  /** tr匹配格式 */
  regExpTr:string,
  /** setText匹配格式 */
  regExpSt:string,
  /** tr文件目录 */
  trDir:string,
  /** localText文件 */
  localTextPath:string,
}

const conf:TConf = {
  locLangExp: configuration.get('jnhi-plugin.locLangExp','language'),
  regExp: configuration.get('jnhi-plugin.regExp',`G_lang([\\s'"]+$1[\\s'"]+?)`),
  regExpTr: configuration.get('jnhi-plugin.regExpTr',`tr([\\s'"]+$1[\\s'"]+?)`),
  regExpSt: configuration.get('jnhi-plugin.regExpSt',`setText(.+?,[\\s'"]+$1[\\s'"]+?`),
  trDir: configuration.get('jnhi-plugin.trDir',`language\\zh_cn\\`),
  localTextPath: configuration.get('jnhi-plugin.localTextPath',`language\\localText.lua`),
};

export default conf;