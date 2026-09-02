# Architecture

This package renders the header notification tray through the Open edX Frontend
Plugin Framework. It fetches notification apps, counters and rows from the LMS;
it does not create or deliver notifications.

The Hyper Academy delta recognizes the `live_sessions` application and its
event types, gives them a readable tab label and selects suitable Paragon icons.
The backend’s target URL is used for navigation, including live-session deep
links.

Keep the package name and exported plugin API compatible with the upstream
package because multiple MFEs consume it. Deployment intentionally installs
this fork after the upstream dependency so one implementation resolves at build
time.
