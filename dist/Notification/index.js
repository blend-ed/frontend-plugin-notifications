function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Bubble, Button, Hyperlink, Icon, IconButton, OverlayTrigger, Popover } from '@openedx/paragon';
import { NotificationsNone, Settings } from '@openedx/paragon/icons';
import { RequestStatus } from './data/constants';
import { useIsOnLargeScreen, useIsOnMediumScreen } from './data/hook';
import NotificationTour from './tours/NotificationTour';
import NotificationPopoverContext from './context/notificationPopoverContext';
import messages from './messages';
import NotificationTabs from './NotificationTabs';
import { notificationsContext } from './context/notificationsContext';
import './notification.scss';
const Notifications = _ref => {
  let {
    notificationAppData,
    showLeftMargin
  } = _ref;
  const intl = useIntl();
  const popoverRef = useRef(null);
  const headerRef = useRef(null);
  const [searchParams] = useSearchParams();
  const buttonRef = useRef(null);
  const [enableNotificationTray, setEnableNotificationTray] = useState(false);
  const [appName, setAppName] = useState('discussion');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [notificationData, setNotificationData] = useState({});
  const [tabsCount, setTabsCount] = useState(notificationAppData?.tabsCount);
  const [openFlag, setOpenFlag] = useState(false);
  const isOnMediumScreen = useIsOnMediumScreen();
  const isOnLargeScreen = useIsOnLargeScreen();
  const toggleNotificationTray = useCallback(() => {
    setEnableNotificationTray(prevState => !prevState);
  }, []);
  const handleClickOutsideNotificationTray = useCallback(event => {
    if (!popoverRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
      setEnableNotificationTray(false);
    }
  }, []);
  useEffect(() => {
    if (openFlag || Object.keys(tabsCount).length === 0) {
      return;
    }
    setAppName(searchParams.get('app') || 'discussion');
    setEnableNotificationTray(searchParams.get('showNotifications') === 'true');
    setOpenFlag(true);
  }, [tabsCount, openFlag, searchParams]);
  useEffect(() => {
    setTabsCount(notificationAppData.tabsCount);
    setNotificationData(prevData => _objectSpread(_objectSpread({}, prevData), notificationAppData));
  }, [notificationAppData]);
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY < 100);
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutsideNotificationTray);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotificationTray);
      window.removeEventListener('scroll', handleScroll);
      setAppName('discussion');
    };
  }, [handleClickOutsideNotificationTray]);
  const enableFeedback = useCallback(() => {
    window.usabilla_live('click');
  }, []);
  const notificationRefs = useMemo(() => ({
    popoverHeaderRef: headerRef,
    notificationRef: popoverRef
  }), [headerRef, popoverRef]);
  const handleActiveTab = useCallback(selectedAppName => {
    setAppName(selectedAppName);
    setNotificationData(prevData => _objectSpread(_objectSpread({}, prevData), {
      notificationListStatus: appName === selectedAppName ? RequestStatus.SUCCESSFUL : RequestStatus.IN_PROGRESS
    }));
  }, [appName]);
  const updateNotificationData = useCallback(data => {
    setNotificationData(prevData => _objectSpread(_objectSpread({}, prevData), data));
    if (data.tabsCount) {
      setTabsCount(data?.tabsCount);
    }
  }, []);
  const notificationContextValue = useMemo(() => _objectSpread(_objectSpread({
    enableNotificationTray,
    handleActiveTab,
    updateNotificationData
  }, notificationData), {}, {
    appName
  }), [enableNotificationTray, appName, handleActiveTab, updateNotificationData, notificationData]);
  return /*#__PURE__*/React.createElement(notificationsContext.Provider, {
    value: notificationContextValue
  }, /*#__PURE__*/React.createElement(OverlayTrigger, {
    trigger: "click",
    key: "bottom",
    placement: "bottom",
    show: enableNotificationTray,
    overlay: /*#__PURE__*/React.createElement(Popover, {
      id: "notificationTray",
      "data-testid": "notification-tray",
      className: classNames('overflow-auto rounded-0 border-0 position-fixed ml-1.5 mt-2', {
        'w-100': !isOnMediumScreen && !isOnLargeScreen,
        'medium-screen': isOnMediumScreen,
        'large-screen': isOnLargeScreen,
        'popover-margin-top height-100vh': !isHeaderVisible,
        'height-91vh ': isHeaderVisible
      })
    }, /*#__PURE__*/React.createElement("div", {
      ref: popoverRef,
      className: "height-inherit"
    }, /*#__PURE__*/React.createElement("div", {
      ref: headerRef
    }, /*#__PURE__*/React.createElement(Popover.Title, {
      as: "h1",
      className: `d-flex justify-content-between px-4 pt-4 pb-2.5 m-0 border-0 text-primary-500 zIndex-2 font-size-18
                  line-height-24 bg-white position-sticky`
    }, intl.formatMessage(messages.notificationTitle), /*#__PURE__*/React.createElement(Hyperlink, {
      destination: `${getConfig().ACCOUNT_SETTINGS_URL && getConfig().ACCOUNT_SETTINGS_URL.endsWith('/') ? `${getConfig().ACCOUNT_SETTINGS_URL}#notifications` : `${getConfig().ACCOUNT_SETTINGS_URL}/#notifications`}`,
      target: "_blank",
      showLaunchIcon: false
    }, /*#__PURE__*/React.createElement(Icon, {
      src: Settings,
      className: "text-primary-500 icon-size-20",
      "data-testid": "setting-icon",
      screenReaderText: "preferences settings icon"
    })))), /*#__PURE__*/React.createElement(Popover.Content, {
      className: "notification-content p-0"
    }, /*#__PURE__*/React.createElement(NotificationPopoverContext.Provider, {
      value: notificationRefs
    }, /*#__PURE__*/React.createElement(NotificationTabs, null))), getConfig().NOTIFICATION_FEEDBACK_URL && /*#__PURE__*/React.createElement(Button, {
      onClick: enableFeedback,
      variant: "warning",
      className: "notification-feedback-widget"
    }, intl.formatMessage(messages.feedback))))
  }, /*#__PURE__*/React.createElement("div", {
    ref: buttonRef,
    id: "notificationIcon",
    className: "mr-1.5"
  }, /*#__PURE__*/React.createElement(IconButton, {
    isActive: enableNotificationTray,
    alt: intl.formatMessage(messages.notificationBellIconAltMessage),
    onClick: toggleNotificationTray,
    src: NotificationsNone,
    iconAs: Icon,
    variant: "light",
    iconClassNames: "text-primary-500",
    size: "inline",
    className: classNames('mr-1 notification-button', {
      'ml-4': showLeftMargin
    }),
    "data-testid": "notification-bell-icon"
  }), tabsCount?.count > 0 && /*#__PURE__*/React.createElement(Bubble, {
    variant: "error",
    "data-testid": "notification-count",
    className: classNames('notification-badge zindex-1 cursor-pointer p-1', {
      'notification-badge-unrounded mt-1': tabsCount.count >= 10,
      'notification-badge-rounded': tabsCount.count < 10
    }),
    onClick: toggleNotificationTray
  }, tabsCount.count >= 100 ? /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, "99", /*#__PURE__*/React.createElement("p", {
    className: "mb-0 plus-icon"
  }, "+")) : tabsCount.count))), /*#__PURE__*/React.createElement(NotificationTour, null));
};
Notifications.propTypes = {
  showLeftMargin: PropTypes.bool,
  notificationAppData: PropTypes.shape({
    apps: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    appsId: PropTypes.arrayOf(PropTypes.string).isRequired,
    isNewNotificationViewEnabled: PropTypes.bool.isRequired,
    notificationExpiryDays: PropTypes.number.isRequired,
    notificationStatus: PropTypes.string.isRequired,
    showNotificationsTray: PropTypes.bool.isRequired,
    tabsCount: PropTypes.shape({
      count: PropTypes.number.isRequired
    }).isRequired
  })
};
Notifications.defaultProps = {
  showLeftMargin: true,
  notificationAppData: {
    apps: {},
    tabsCount: {
      count: 0
    },
    appsId: [],
    isNewNotificationViewEnabled: false,
    notificationExpiryDays: 0,
    notificationStatus: '',
    showNotificationsTray: false
  }
};
export default Notifications;
//# sourceMappingURL=index.js.map