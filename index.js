import fs from 'fs';
import parse from '@babel/parser';
import traverse from '@babel/traverse';
import { transformFromAstSync } from '@babel/core';
import path from 'path';
import ejs from 'ejs';
import jsonLoader from './jsonLoader.js';
let ID = 0;
const webpackConfig = {
    module: {
        rules: [
            {
                test: /\.json$/,
                use: jsonLoader
            },
        ],
    },
};
/**
 * 根据文件路径解析相应文件，
 * 并返回该文件所依赖的“内容”
 * 和该文件转译后的代码（使用babel）
 * @param filePath
 * @returns
 */
function createAsset(filePath) {
    // 1.获取文件内容
    let source = fs.readFileSync(filePath, {
        encoding: 'utf-8'
    });
    // 处理loader
    const loaders = webpackConfig.module.rules;
    loaders.forEach(({ test, use }) => {
        if (new RegExp(test).test(filePath)) {
            source = use(source);
        }
    });
    // 编译为ast
    const ast = parse.parse(source, {
        sourceType: 'module'
    });
    const deps = [];
    // 遍历ast，并获取依赖项
    traverse.default(ast, {
        ImportDeclaration({ node }) {
            deps.push(node.source.value);
        }
    });
    const id = ID++;
    // 从ast转为源码, 这里主要是为了将代码中es6模块转为commonjs模块
    let { code } = transformFromAstSync(ast, undefined, {
        presets: ["@babel/preset-env"]
    });
    return {
        id,
        filePath,
        code,
        deps
    };
}
/**
 * 从入口开始，构造“依赖图”，
 * @param entry
 * @returns
 */
function createGraph(entry) {
    const mainAsset = createAsset(entry);
    const queue = [mainAsset];
    // 通过这种方式来实现类似递归的效果,当解析的文件中存在其他的依赖时，
    // 把这个依赖添加到queue中
    for (let asset of queue) {
        asset.mapping = {};
        // 这个模块所在的目录
        const dirname = path.dirname(asset.filePath);
        //遍历资源的依赖
        asset.deps.forEach((relativePath) => {
            const absolutePath = path.resolve(dirname, relativePath);
            const child = createAsset(absolutePath);
            asset.mapping[relativePath] = child.id;
            // @ts-ignore
            queue.push(child);
        });
    }
    return queue;
}
/**
 * 根据依赖图dependency graph，使用ejs构造最终的打包代码
 * @param graph
 */
function build(graph) {
    const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf8' });
    const data = graph.map((asset) => {
        return {
            filePath: asset.filePath,
            code: asset.code
        };
    });
    const code = ejs.render(template, { data });
    fs.writeFileSync('./dist/bundle.js', code);
}
const graph = createGraph('./example/main.js');
build(graph);
