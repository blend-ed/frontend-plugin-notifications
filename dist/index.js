import React, { StrictMode } from 'react';
import Notifications from './Notification';
import { useAppNotifications, useNotification } from './Notification/data/hook';
export const NotificationsTray = () => {
  const {
    notificationAppData
  } = useAppNotifications();
  return notificationAppData?.showNotificationsTray ? /*#__PURE__*/React.createElement(StrictMode, null, /*#__PURE__*/React.createElement(Notifications, {
    notificationAppData: notificationAppData
  })) : '';
};
export default NotificationsTray;
export { Notifications, useAppNotifications, useNotification };
//# sourceMappingURL=index.js.map