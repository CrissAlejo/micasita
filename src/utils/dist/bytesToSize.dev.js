"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/* eslint-disable no-restricted-properties */
var bytesToSize = function bytesToSize(bytes) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  if (bytes === 0) return '0 Bytes';
  var k = 1024;
  var dm = decimals < 0 ? 0 : decimals;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), " ").concat(sizes[i]);
};

var _default = bytesToSize;
exports["default"] = _default;