# next-workbox

> Next.js plugin for [workbox](https://developers.google.com/web/tools/workbox/). The plugin help you to use service worker for Next.js and now 2.0

- `After 2.x, only works with now 2.0 from zeit in production mode`. You can check out after publishing your app to [now](https://zeit.co/now)
- Built on top of [next-workbox-webpack-plugin](https://github.com/ragingwind/next-workbox-webpack-plugin), you can use [almost all options](https://github.com/ragingwind/next-workbox-webpack-plugin#usage)

# Installation

```sh
npm install --save-dev next-workbox
```

or

```
yarn add -D next-workbox
```

# Usage

```js
// next.config.js
const withWorkbox = require('next-workbox');

module.exports = withWorkbox({
  generateBuildId: async () => {
    // You must have own custom build id
    return 'my-build-id';
  }
});
```

## License

MIT © [Jimmy Moon](https://jimmymoon.dev)
