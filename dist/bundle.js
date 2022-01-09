//所有文件放在一起 会有什么问题？ // 1 命名冲突 怎么解决？ 声明一个函数 // 2
处理import import 必须放在顶层 可以类似cjs 自己实现require 函数这个函数做的事情
就是从根据key（filePath） 从 对应的map 或者叫module 里面 取出对应的函数 module
： {filePath : function} //下一步就是动态生成这个文件 //不变的 IEFE 里面的内容
require 函数 以及 require 函数的执行 //变化的内容 moudleMap
里面的变化也是有规律的 依赖的参数是不变的 //如何实现 动态生成这个文件？ method1
字符串拼接（nodejs里面就是这么做的） mothod2 模版字符串引擎生成 （input data）=>
(ouput data with template) //自己实现require函数 (function (moduleMap) {
function require(filePath) { //映射 moduleMap const fn = moduleMap[filePath];
const module = { exports: {}, }; //调用并且传递参数 fn(require, module,
module.exports); //require 返回对象module.exports return module.exports; }
//入口函数 不变的 可以通过webpack.config.js里面entry读取 require("./main.js");
})({ "./foo.js": function (require, module, exports) { const foo = () => {
return "foo"; }; module.exports = { foo, }; }, "./main.js": function (require,
module, exports) { //main.js const { foo } = require("./foo.js");
//为什么写成require 因为 import不可以不写在顶层 我们需要自己实现一个require 函数
foo(); console.log("main"); }, });
