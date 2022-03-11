"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var track = function track() {
  var _window;

  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (!window.gtag) {
    return;
  }

  (_window = window).gtag.apply(_window, arguments);
};

var pageview = function pageview(props) {
  track('config', process.env.REACT_APP_GA_MEASUREMENT_ID, props);
};

var event = function event(type, props) {
  track('event', type, props);
};

var _default = {
  pageview: pageview,
  event: event
};
exports["default"] = _default;