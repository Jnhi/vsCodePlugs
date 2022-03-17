import * as vscode from 'vscode';
const Configuration = vscode.workspace.getConfiguration();

/** 配置 */
export interface TConf {
  /** 多语言文件夹位置 */
  // configPath:string,
  /** 多语言文本目录匹配字符串 */
  locLangExp:string,
  /** 匹配格式 */
  regExp:string,
  /** 是否开启监听模式 */
  // watchMode:boolean,
  /** 引入多语言对象的语句 */
  // import: string,
}

const Conf:TConf = {
  // configPath: Configuration.get('react-intl-universal-i18n.configPath','src/locales'),
  locLangExp: Configuration.get('jnhi-plugin.locLangExp','language'),
  regExp: Configuration.get('jnhi-plugin.regExp',`G_lang('$1')`),
  // watchMode: Configuration.get('react-intl-universal-i18n.watchMode',false),
  // import: Configuration.get('react-intl-universal-i18n.import',"import {intl} from '@/utils/js/locales';"),
};

export default Conf;