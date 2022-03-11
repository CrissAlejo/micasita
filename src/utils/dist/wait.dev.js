"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var wait = function wait(time) {
  return new Promise(function (res) {
    return setTimeout(res, time);
  });
};

var _default = wait;
exports["default"] = _default;