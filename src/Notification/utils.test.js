import { PostOutline, VideoCamera } from '@openedx/paragon/icons';

import { getIconByType } from './utils';

describe('getIconByType', () => {
  it.each([
    ['live_session_reminder', 'text-primary-500'],
    ['live_session_scheduled', 'text-primary-500'],
    ['live_session_rescheduled', 'text-primary-500'],
    ['live_session_cancelled', 'text-danger'],
    ['live_session_starting_now', 'text-success'],
    ['host_session_reminder', 'text-primary-500'],
    ['host_session_starting_now', 'text-success'],
  ])('uses the live-session icon for %s', (type, className) => {
    expect(getIconByType(type)).toEqual({ icon: VideoCamera, class: className });
  });

  it('keeps the generic fallback for unknown notification types', () => {
    expect(getIconByType('unknown')).toEqual({ icon: PostOutline, class: 'text-primary-500' });
  });
});
