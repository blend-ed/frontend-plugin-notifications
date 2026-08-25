function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { useAppNotifications } from './data/hook';
export default function withNotifications(Component) {
  return function WrapperComponent(props) {
    const {
      notificationAppData
    } = useAppNotifications();
    return /*#__PURE__*/React.createElement(Component, _extends({}, props, {
      notificationAppData: notificationAppData
    }));
  };
}
//# sourceMappingURL=withNotifications.js.map