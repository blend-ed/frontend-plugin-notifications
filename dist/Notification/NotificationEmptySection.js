import React, { useContext } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon, IconButton } from '@openedx/paragon';
import { NotificationsNone } from '@openedx/paragon/icons';
import NotificationPopoverContext from './context/notificationPopoverContext';
import messages from './messages';
const EmptyNotifications = () => {
  const intl = useIntl();
  const {
    popoverHeaderRef,
    notificationRef
  } = useContext(NotificationPopoverContext);
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column justify-content-center align-items-center",
    "data-testid": "notifications-empty-list",
    style: {
      height: `${notificationRef.current.clientHeight - popoverHeaderRef.current.clientHeight}px`
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    isActive: true,
    alt: intl.formatMessage(messages.notificationBellIconAltMessage),
    src: NotificationsNone,
    iconAs: Icon,
    variant: "light",
    iconClassNames: "text-primary-500",
    className: "ml-4 mr-1 notification-button notification-lg-bell-icon pl-2",
    "data-testid": "notification-bell-icon"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mx-auto mt-3.5 mb-3 lead notification-end-title line-height-24"
  }, intl.formatMessage(messages.noNotificationsYetMessage)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-row mx-auto text-gray-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "small line-height-normal"
  }, intl.formatMessage(messages.noNotificationHelpMessage))));
};
export default /*#__PURE__*/React.memo(EmptyNotifications);
//# sourceMappingURL=NotificationEmptySection.js.map