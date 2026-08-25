import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import * as timeago from 'timeago.js';
import DOMPurify from 'dompurify';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon, Hyperlink } from '@openedx/paragon';
import messages from './messages';
import timeLocale from '../common/time-locale';
import { getIconByType } from './utils';
import { useNotification } from './data/hook';
import { notificationsContext } from './context/notificationsContext';
const NotificationRowItem = _ref => {
  let {
    id,
    type,
    contentUrl,
    content,
    courseName,
    createdAt,
    lastRead
  } = _ref;
  timeago.register('time-locale', timeLocale);
  const intl = useIntl();
  const {
    markNotificationsAsRead
  } = useNotification();
  const {
    updateNotificationData
  } = useContext(notificationsContext);
  const sanitizedContent = DOMPurify.sanitize(content);
  const handleMarkAsRead = useCallback(async () => {
    if (!lastRead) {
      const data = await markNotificationsAsRead(id);
      updateNotificationData(data);
    }
  }, [id, lastRead, markNotificationsAsRead, updateNotificationData]);
  const handleNotificationClick = async event => {
    event.preventDefault();
    await handleMarkAsRead();
    window.open(contentUrl, '_blank');
  };
  const {
    icon: iconComponent,
    class: iconClass
  } = getIconByType(type);
  return /*#__PURE__*/React.createElement(Hyperlink, {
    target: "_blank",
    className: "d-flex mb-2 align-items-center text-decoration-none notification-post-link",
    destination: contentUrl,
    onClick: event => handleNotificationClick(event, contentUrl),
    "data-testid": `notification-${id}`,
    showLaunchIcon: false
  }, /*#__PURE__*/React.createElement(Icon, {
    src: iconComponent,
    className: `${iconClass} mr-4 notification-icon`,
    "data-testid": `notification-icon-${id}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex w-100",
    "data-testid": "notification-contents"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "py-2 w-100 px-0 cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "line-height-24 text-gray-700 mb-2 notification-item-content overflow-hidden content"
    // eslint-disable-next-line react/no-danger
    ,
    dangerouslySetInnerHTML: {
      __html: sanitizedContent
    },
    "data-testid": `notification-content-${id}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "py-0 d-flex"
  }, /*#__PURE__*/React.createElement("span", {
    className: "x-small text-gray-500 line-height-20"
  }, /*#__PURE__*/React.createElement("span", {
    "data-testid": `notification-course-${id}`
  }, courseName), /*#__PURE__*/React.createElement("span", {
    className: "text-light-700 px-1.5"
  }, intl.formatMessage(messages.fullStop)), /*#__PURE__*/React.createElement("span", {
    "data-testid": `notification-created-date-${id}`
  }, " ", timeago.format(createdAt, 'time-locale'))))), !lastRead && /*#__PURE__*/React.createElement("div", {
    className: "d-flex py-1.5 px-1.5 ml-2 cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-brand-500 rounded unread",
    "data-testid": `unread-notification-${id}`
  })))));
};
NotificationRowItem.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  contentUrl: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  courseName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  lastRead: PropTypes.string.isRequired
};
export default /*#__PURE__*/React.memo(NotificationRowItem);
//# sourceMappingURL=NotificationRowItem.js.map