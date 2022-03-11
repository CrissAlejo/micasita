"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axiosInstance = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var axiosInstance = _axios["default"].create({
  baseURL: "http://127.0.0.1:8000/api"
});

exports.axiosInstance = axiosInstance;
axiosInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  Promise.reject(error.response && error.response.data || 'Something went wrong');
});