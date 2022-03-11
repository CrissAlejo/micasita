"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axiosMockAdapter = _interopRequireDefault(require("axios-mock-adapter"));

var _axios = _interopRequireDefault(require("./axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var axiosMockAdapter = new _axiosMockAdapter["default"](_axios["default"], {
  delayResponse: 0
});
var _default = axiosMockAdapter;
exports["default"] = _default;