# Development

```bash
npm ci
npm run lint
npm test -- --runInBand
npm run build
```

For hot reload in a mounted MFE, build this package and point that MFE’s ignored
`module.config.js` at the local distribution:

```javascript
module.exports = {
  localModules: [{
    moduleName: '@edx/frontend-plugin-notifications',
    dir: '../src/frontend-plugin-notifications',
    dist: 'dist',
  }],
};
```

`module.config.js` changes module resolution only; the consuming MFE still needs
the notification slot configuration supplied by the notifications Tutor plugin.
Rebuild this package after source changes when the consumer resolves `dist`.
