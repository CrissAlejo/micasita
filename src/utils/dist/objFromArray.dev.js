"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var objFromArray = function objFromArray(arr) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';
  return arr.reduce(function (accumulator, current) {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
};

var _default = objFromArray;
exports["default"] = _default;