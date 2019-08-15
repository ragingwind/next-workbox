const { join } = require('path');
const { writeFileSync } = require('fs');
const findCacheDir = require('find-cache-dir');
const NextWorkboxWebpackPlugin = require('next-workbox-webpack-plugin');
const { registerScript } = require('./service-worker-register');

const defaultRegisterSW = {
  src: '/sw.js',
  scope: '/'
};

const withSWContent = (entry, content) => {
  const originalEntry = entry;
  const output = join(
    findCacheDir({ name: 'next-workbox', create: true }),
    'register-sw.js'
  );

  writeFileSync(output, content);

  return async () => {
    const entries = await originalEntry();

    if (entries['main.js']) {
      entries['main.js'].unshift(output);
    }

    return entries;
  };
};

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const {
        isServer,
        dev,
        buildId,
        config: { distDir }
      } = options;

      const { webpack, workbox = {} } = nextConfig;

      if (!isServer && !dev) {
        // append server-worker register script to main.js chunk
        config.entry = withSWContent(config.entry, registerScript(defaultRegisterSW));

        // push workbox webpack plugin
        config.plugins.push(
          new NextWorkboxWebpackPlugin({
            ...workbox,
            distDir,
            buildId,
            swDestRoot: `.next/static/${buildId}/pages`,
            swURLRoot: `_next/static/${buildId}/pages`
          })
        );
      }

      if (typeof webpack === 'function') {
        return webpack(config, options);
      }

      return config;
    }
  });
};
