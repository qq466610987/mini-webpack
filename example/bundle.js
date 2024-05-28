// 这一部分代码的作用是模拟打包后的代码
// require函数是模拟commonjs的require函数的作用，
// 传入的参数其实就是一个Map<filepath: function>
; (function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id]
    const module = {
      exports: {}
    }
    function localRequire(filePath) {
      const id = mapping[filePath]
      return require(id)
    }
    fn(localRequire, module, module.exports)

    return module.exports
  }
  require(1)
})({
  1: [function (require, module, exports) {
    const {foo} = require("./foo.js")
    foo()
  }, {
    './foo.js': 2
  }],
  2: [function (require, module, exports) {
    function foo() {
      console.log('foo')
    }
    module.exports = { foo }
  }, {}],
})

