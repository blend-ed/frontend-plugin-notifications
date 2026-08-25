const _excluded = ["countByAppName"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import { useContext, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { camelCaseObject } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { breakpoints, useWindowSize } from '@openedx/paragon';
import { RequestStatus } from './constants';
import { notificationsContext } from '../context/notificationsContext';
import { getNotificationsList, getNotificationCounts, markNotificationSeen, markAllNotificationRead, markNotificationRead } from './api';
export function useIsOnMediumScreen() {
  const windowSize = useWindowSize();
  return breakpoints.large.maxWidth > windowSize.width && windowSize.width >= breakpoints.medium.minWidth;
}
export function useIsOnLargeScreen() {
  const windowSize = useWindowSize();
  return windowSize.width >= breakpoints.extraLarge.minWidth;
}
export function useNotification() {
  const {
    appName,
    apps,
    tabsCount,
    notifications,
    updateNotificationData
  } = useContext(notificationsContext);
  const normalizeNotificationCounts = useCallback(_ref => {
    let {
        countByAppName
      } = _ref,
      countData = _objectWithoutProperties(_ref, _excluded);
    const appIds = Object.keys(countByAppName);
    const notificationApps = appIds.reduce((acc, appId) => {
      acc[appId] = [];
      return acc;
    }, {});
    return _objectSpread(_objectSpread({}, countData), {}, {
      appIds,
      notificationApps,
      countByAppName
    });
  }, []);
  const normalizeNotifications = data => {
    const newNotificationIds = data.results.map(notification => notification.id.toString());
    const notificationsKeyValuePair = data.results.reduce((acc, obj) => {
      acc[obj.id] = obj;
      return acc;
    }, {});
    const pagination = {
      numPages: data.numPages,
      currentPage: data.currentPage,
      hasMorePages: !!data.next
    };
    return {
      newNotificationIds,
      notificationsKeyValuePair,
      pagination
    };
  };
  const getNotifications = useCallback(() => {
    try {
      const notificationIds = apps[appName] || [];
      return notificationIds.map(notificationId => notifications[notificationId]) || [];
    } catch (error) {
      return {
        notificationStatus: RequestStatus.FAILED
      };
    }
  }, [apps, appName, notifications]);
  const fetchAppsNotificationCount = useCallback(async () => {
    try {
      const data = await getNotificationCounts();
      const normalisedData = camelCaseObject(data);

      // Application names are opaque backend identifiers, not response field
      // names. Preserve values such as `live_sessions` so follow-up list and
      // seen requests send the exact app_name understood by the API.
      normalisedData.countByAppName = data.count_by_app_name || data.countByAppName;
      const normalizedCounts = normalizeNotificationCounts(normalisedData);
      const {
        countByAppName,
        appIds,
        notificationApps,
        count,
        showNotificationsTray,
        notificationExpiryDays,
        isNewNotificationViewEnabled
      } = normalizedCounts;
      return {
        tabsCount: _objectSpread({
          count
        }, countByAppName),
        appsId: appIds,
        apps: notificationApps,
        showNotificationsTray,
        notificationStatus: RequestStatus.SUCCESSFUL,
        notificationExpiryDays,
        isNewNotificationViewEnabled
      };
    } catch (error) {
      return {
        notificationStatus: RequestStatus.FAILED,
        apps: {},
        appsId: [],
        isNewNotificationViewEnabled: false,
        notificationExpiryDays: 0,
        showNotificationsTray: false,
        tabsCount: {
          count: 0
        }
      };
    }
  }, [normalizeNotificationCounts]);
  const fetchNotificationList = useCallback(async function (app) {
    let page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    let pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    let trayOpened = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    try {
      updateNotificationData({
        notificationListStatus: RequestStatus.IN_PROGRESS
      });
      const data = await getNotificationsList(app, page, pageSize, trayOpened);
      const normalizedData = normalizeNotifications(camelCaseObject(data));
      const {
        newNotificationIds,
        notificationsKeyValuePair,
        pagination
      } = normalizedData;
      const existingNotificationIds = apps[appName] || [];
      const {
        count
      } = tabsCount;
      return {
        apps: _objectSpread(_objectSpread({}, apps), {}, {
          [appName]: Array.from(new Set([...existingNotificationIds, ...newNotificationIds]))
        }),
        notifications: _objectSpread(_objectSpread({}, notifications), notificationsKeyValuePair),
        tabsCount: _objectSpread(_objectSpread({}, tabsCount), {}, {
          count: count - tabsCount[appName],
          [appName]: 0
        }),
        notificationListStatus: RequestStatus.SUCCESSFUL,
        pagination
      };
    } catch (error) {
      return {
        notificationStatus: RequestStatus.FAILED
      };
    }
  }, [appName, apps, tabsCount, notifications, updateNotificationData]);
  const markNotificationsAsSeen = useCallback(async app => {
    try {
      await markNotificationSeen(app);
      return {
        notificationStatus: RequestStatus.SUCCESSFUL
      };
    } catch (error) {
      return {
        notificationStatus: RequestStatus.FAILED
      };
    }
  }, []);
  const markAllNotificationsAsRead = useCallback(async app => {
    try {
      await markAllNotificationRead(app);
      const updatedNotifications = Object.fromEntries(Object.entries(notifications).map(_ref2 => {
        let [key, notification] = _ref2;
        return [key, _objectSpread(_objectSpread({}, notification), {}, {
          lastRead: new Date().toISOString()
        })];
      }));
      return {
        notifications: updatedNotifications,
        notificationStatus: RequestStatus.SUCCESSFUL
      };
    } catch (error) {
      return {
        notificationStatus: RequestStatus.FAILED
      };
    }
  }, [notifications]);
  const markNotificationsAsRead = useCallback(async notificationId => {
    try {
      const data = camelCaseObject(await markNotificationRead(notificationId));
      const date = new Date().toISOString();
      const notificationList = _objectSpread({}, notifications);
      notificationList[data.id] = _objectSpread(_objectSpread({}, notifications[data.id]), {}, {
        lastRead: date
      });
      return {
        notifications: notificationList,
        notificationStatus: RequestStatus.SUCCESSFUL
      };
    } catch (error) {
      return {
        notificationStatus: RequestStatus.FAILED
      };
    }
  }, [notifications]);
  return {
    fetchAppsNotificationCount,
    fetchNotificationList,
    getNotifications,
    markNotificationsAsSeen,
    markAllNotificationsAsRead,
    markNotificationsAsRead
  };
}
export function useAppNotifications() {
  const {
    authenticatedUser
  } = useContext(AppContext);
  const [isNewNotificationView, setIsNewNotificationView] = useState(false);
  const [notificationAppData, setNotificationAppData] = useState();
  const {
    fetchAppsNotificationCount
  } = useNotification();
  const location = useLocation();
  const fetchNotificationData = useCallback(async () => {
    const data = await fetchAppsNotificationCount();
    const {
      isNewNotificationViewEnabled
    } = data;
    setIsNewNotificationView(isNewNotificationViewEnabled);
    setNotificationAppData(data);
  }, [fetchAppsNotificationCount]);
  useEffect(() => {
    const fetchNotifications = async () => {
      await fetchNotificationData();
    };
    if (authenticatedUser) {
      fetchNotifications();
    }
  }, [fetchNotificationData, authenticatedUser, location.pathname]);
  return {
    isNewNotificationView,
    notificationAppData
  };
}
//# sourceMappingURL=hook.js.map