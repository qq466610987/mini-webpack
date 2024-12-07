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

  "./example/main.js": function (require, module, exports) {
    "use strict";

    var _foo = _interopRequireDefault(require("./foo.js"));
    var _user = _interopRequireDefault(require("./user.json"));
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    (0, _foo["default"])(1, 2);
    console.log('main.js');
    console.log(_user["default"]);
  },

  "H:\code-study\mini-webpack\example\foo.js": function (require, module, exports) {
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

  "H:\code-study\mini-webpack\example\user.json": function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    var _default = exports["default"] = "{\r\n  \"name\": \"lm\",\r\n  \"age\": 18\r\n}";
  },

  "H:\code-study\mini-webpack\example\bar.js": function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    var _default = exports["default"] = 'foo';
  },
});