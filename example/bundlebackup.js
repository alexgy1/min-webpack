//所有文件放在一起 会有什么问题？
// 1 命名冲突 怎么解决？ 声明一个函数

// 2 处理import  import 必须放在顶层

//自己实现require函数
(function (moduleMap) {
  function require(filePath) {
    //映射
    const map = {
      "./foo.js": foojs,
      "./main.js": mainjs,
    };

    const fn = map[filePath];

    const module = {
      exports: {},
    };
    //调用并且传递参数
    fn(require, module, module.exports);

    //require 返回对象module.exports
    return module.exports;
  }

  require("./main.js");

  //main
  function mainjs(require, module, exports) {
    //main.js
    const { foo } = require("./foo.js"); //为什么写成require 因为 import不可以不写在顶层 我们需要自己实现一个require 函数
    foo();
    console.log("main");
  }
  //foo
  function foojs(require, module, exports) {
    const foo = () => {
      return "foo";
    };
    module.exports = {
      foo,
    };
  }
})();
