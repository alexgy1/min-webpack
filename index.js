import fs from "fs";
import path from "path";

import babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import { transformFromAst } from "babel-core";
import ejs from "ejs";

function createAssets(filePath = "./example/main.js") {
  //1读取文件

  const files = fs.readFileSync(filePath, {
    encoding: "utf-8",
  });
  //2获取依赖关系（DAG 有向无环图)
  //2.1 可以使用正则
  //2.2 也可以使用ast //https://astexplorer.net/
  const ast = babelParser.parse(files, { sourceType: "module" });
  //   console.log(ast); //获取ast

  const deps = [];
  //遍历tree npm i @babel/traverse
  traverse.default(ast, {
    //https://astexplorer.net/ 看到 获取这个type（ImportDeclaration）类型的node.source.value
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });

  //transform imort to own require method by babel-core transformFromAst because we have ast here
  //to use transformFromAst npm i babel-core
  const { code } = transformFromAst(ast, null, {
    //install  npm i babel-preset-env
    presets: ["env"],
  });
  console.log("code", code);
  return {
    // source: files,
    code,
    deps,
  };
}
// const assets = createAssets();
// console.log(assets);
// {
//     source: 'import foo from "./foo";\n\nfoo();\nconsole.log("main");\n',
//     deps: [ './foo' ]
//   }

function createGraph() {
  const mainAsset = createAssets();

  const queue = [mainAsset];

  for (let asset of queue) {
    asset.deps.forEach((relativePath) => {
      console.log("realitivePath => ", relativePath); //realitivePath =>  ./foo
      //   const childAsset = createAssets(path.resolve("./example", relativePath));
      //   console.log(childAsset);
    });
  }
}

createGraph();

let pathUrl = path.resolve("./example", "./foo");
const f = fs.readFileSync(pathUrl + ".js", {
  encoding: "utf-8",
});
console.log(f);

/**
 * input graph
 * output bundle.js like (example/bundle.js)
 *
 * 变化的量 是  我们需要自己处理
 *  1 动态拿到 依赖的路径  done by  createAssets
 *  2以及将定义的内容的import语法转化成自己写的require的方式  可以借助babel-core 完成
 */
function build(graph) {
  //impl with ejs template
  const template = fs.readFileSync("./example/bundle.ejs", "utf-8");
  const data = genfilePathAndCode(graph);
  const code = ejs.render(template, { data });
  //需要有dist目录 没有就创建一个
  fs.writeFileSync("./dist/bundle.js", code);
}

function genfilePathAndCode(graph) {
  return graph.map((asset) => {
    let { filePath, code } = asset;
    return { filePath, code };
  });
}
// build();

createAssets();
