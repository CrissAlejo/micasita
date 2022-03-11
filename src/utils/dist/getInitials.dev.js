"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var getInitials = function getInitials() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return name.replace(/\s+/, ' ').split(' ').slice(0, 2).map(function (v) {
    return v && v[0].toUpperCase();
  }).join('');
};

var _default = getInitials;
exports["default"] = _default;