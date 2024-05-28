// 这一部分代码的作用是模拟打包后的代码
// require函数是模拟commonjs的require函数的作用，
// 传入的参数其实就是一个Map<filepath: function>
  ; (function (modules) {
  function require(filePath) {
  const fn = modules[filePath]
  const module = {
  exports: {}
  }
  fn(require, module, module.exports)

  return module.exports
  }
  require("./main.js")
  })({
  
  "./example/main.js": function (require, module, exports) {
    "use strict";

var _foo = _interopRequireDefault(require("./foo.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
(0, _foo["default"])(1, 2);
console.log('main.js');
  },
    
  "/Users/liuming/code_study/my-webpack/example/foo.js": function (require, module, exports) {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _bar = _interopRequireDefault(require("./bar.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var add = function add(a, b) {
  console.log(_bar["default"]);
  return a + b;
};
var _default = exports["default"] = add;
  },
    
  "/Users/liuming/code_study/my-webpack/example/bar.js": function (require, module, exports) {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = exports["default"] = 'foo';
  },
    

  });