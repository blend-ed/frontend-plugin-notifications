# Configuration

This fork adds no provider credentials or standalone runtime settings. It
expects the consuming MFE to provide:

- an authenticated Open edX frontend-platform context;
- a notification-tray plugin slot in the header;
- the standard LMS notification APIs;
- runtime MFE URLs used by notification targets.

The Tutor plugin pins and installs this repository after the upstream
notifications package. Do not install both as independently imported package
names; they intentionally share `@edx/frontend-plugin-notifications` so the fork
is the resolved implementation.
