function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { useMemo, useContext, useCallback } from 'react';
import { camelCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from '../messages';
import tourCheckpoints from '../constants';
import { getNotificationsTours, updateNotificationsTour } from './api';
import { RequestStatus } from '../../data/constants';
import { notificationsContext } from '../../context/notificationsContext';
export function camelToConstant(string) {
  return string.replace(/[A-Z]/g, match => `_${match}`).toUpperCase();
}
export function useNotificationTour() {
  const {
    tours,
    updateNotificationData
  } = useContext(notificationsContext);
  function normaliseTourData(data) {
    return data.map(tour => _objectSpread(_objectSpread({}, tour), {}, {
      enabled: true
    }));
  }
  const fetchNotificationTours = useCallback(async () => {
    try {
      const data = await getNotificationsTours();
      const normalizedData = camelCaseObject(normaliseTourData(data));
      return {
        tours: normalizedData,
        loading: RequestStatus.SUCCESSFUL
      };
    } catch (error) {
      return {
        notificationStatus: RequestStatus.FAILED
      };
    }
  }, []);
  const updateTourShowStatus = useCallback(async tourId => {
    try {
      const data = await updateNotificationsTour(tourId);
      const normalizedData = camelCaseObject(data);
      const tourIndex = tours.findIndex(tour => tour.id === normalizedData.id);
      tours[tourIndex] = normalizedData;
      return {
        tours,
        loading: RequestStatus.SUCCESSFUL
      };
    } catch (error) {
      return {
        notificationStatus: RequestStatus.FAILED
      };
    }
  }, [tours]);
  const handleOnOkay = useCallback(async id => {
    const data = await updateTourShowStatus(id);
    updateNotificationData(data);
  }, [updateNotificationData, updateTourShowStatus]);
  const useTourConfiguration = async () => {
    const intl = useIntl();
    const toursConfig = useMemo(() => tours?.map(tour => Object.keys(tourCheckpoints(intl)).includes(tour.tourName) && {
      tourId: tour.tourName,
      dismissButtonText: intl.formatMessage(messages.dismissButtonText),
      endButtonText: intl.formatMessage(messages.endButtonText),
      enabled: tour && Boolean(tour.enabled && tour.showTour),
      onEnd: () => handleOnOkay(tour.id),
      checkpoints: tourCheckpoints(intl)[camelToConstant(tour.tourName)]
    }), [intl]);
    return toursConfig;
  };
  return {
    fetchNotificationTours,
    updateTourShowStatus,
    useTourConfiguration
  };
}
//# sourceMappingURL=hooks.js.map