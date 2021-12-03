import { languages,ExtensionContext,workspace, CompletionItem, CompletionItemKind } from 'vscode';

export class Provider {
    /**
     * 自动提示类
     * @param {*} context ExtensionContext
     */
    constructor(context: ExtensionContext) {
        /**
         * 自动提示实现，这里模拟一个很简单的操作
         * 当输入 this.dependencies.xxx时自动把package.json中的依赖带出来
         * 当然这个例子没啥实际意义，仅仅是为了演示如何实现功能
         * @param {*} document 
         * @param {*} position 
         * @param {*} token 
         * @param {*} context 
         */
        function provideCompletionItems(document: { lineAt: (arg0: any) => any; }, position: { character: any; }, token: any, context: any) {
            const line = document.lineAt(position);
            var locPath = ""
            if (workspace.workspaceFolders) {
                const rootPath: string = workspace.workspaceFolders[0].name;
                console.log(workspace.workspaceFolders[0].name);
    
                var cocosIndex = rootPath.indexOf("cocosstudio")
                locPath = workspace.workspaceFolders + "\\language\\localText.lua";
                if(cocosIndex == -1){
                    locPath = workspace.workspaceFolders + "\\cocosstudio\\language\\localText.lua";
                }
            }
        
            // 只截取到光标位置为止，防止一些特殊情况
            const lineText = line.text.substring(0, position.character);
            // 简单匹配，只要当前光标前的字符串为`this.dependencies.`都自动带出所有的依赖
            if(/(^|=| )w+G_lang\("$/g.test(lineText)) {
            const json = require(`${locPath}/package.json`);
            const dependencies = Object.keys(json.dependencies || {}).concat(Object.keys(json.devDependencies || {}));
            return dependencies.map(dep => {
            // vscode.CompletionItemKind 表示提示的类型
            return new CompletionItem(dep, CompletionItemKind.Field);
            })
            }
        }
        /**
         * 光标选中当前自动补全item时触发动作，一般情况下无需处理
         * @param {*} item 
         * @param {*} token 
         */
        function resolveCompletionItem(item: any, token: any) {
            return null;
        }

        // 注册代码建议提示，只有当按下“.”时才触发
        context.subscriptions.push(languages.registerCompletionItemProvider("lua", {
            provideCompletionItems,
            resolveCompletionItem
            }));
        }

}