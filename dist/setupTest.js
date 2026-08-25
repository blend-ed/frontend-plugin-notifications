function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import '@testing-library/jest-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { render as rtlRender } from '@testing-library/react';
import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { configure as configureI18n, IntlProvider } from '@edx/frontend-platform/i18n';
import { configure as configureLogging } from '@edx/frontend-platform/logging';
import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;
mergeConfig(_objectSpread({}, process.env));
jest.mock('@src/generic/messages', () => jest.fn(() => {}), {
  virtual: true
});

/* eslint-disable no-console */
const supressWarningBlock = callback => {
  const originalConsoleWarning = console.warn;
  console.warn = jest.fn();
  callback();
  console.warn = originalConsoleWarning;
};
/* eslint-enable no-console */

class MockLoggingService {
  constructor() {
    // eslint-disable-next-line no-console
    _defineProperty(this, "logInfo", jest.fn(infoString => console.log(infoString)));
    // eslint-disable-next-line no-console
    _defineProperty(this, "logError", jest.fn(errorString => console.log(errorString)));
  }
}
export const initializeIntl = () => {
  const loggingService = configureLogging(MockLoggingService, {
    config: getConfig()
  });

  // i18n doesn't have a service class to return.
  // ignore missing/unexpect locale warnings from @edx/frontend-platform/i18n
  // it is unnecessary and not relevant to the tests
  supressWarningBlock(() => configureI18n({
    config: getConfig(),
    loggingService,
    messages: []
  }));
};
function render(ui) {
  let _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let renderOptions = Object.assign({}, (_objectDestructuringEmpty(_ref), _ref));
  const Wrapper = _ref2 => {
    let {
      children
    } = _ref2;
    return (
      /*#__PURE__*/
      // eslint-disable-next-line react/jsx-filename-extension
      React.createElement(IntlProvider, {
        locale: "en"
      }, children)
    );
  };
  Wrapper.propTypes = {
    children: PropTypes.node.isRequired
  };
  return rtlRender(ui, _objectSpread({
    wrapper: Wrapper
  }, renderOptions));
}
export default render;
//# sourceMappingURL=setupTest.js.map