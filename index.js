const {join} = require('path')
const {writeFileSync} = require('fs')
const findCacheDir = require('find-cache-dir')
const NextWorkboxWebpackPlugin = require('next-workbox-webpack-plugin')
const {registerScript} = require('./service-worker-register')

const defaultRegisterSW = {
  src: '/static/workbox/sw.js',
  scope: '../../'
}

const appendRegisterSW = (entry, content) => {
  const originalEntry = entry
  const output = join(findCacheDir({name: 'next-workbox', create: true}), 'register-sw.js')

  writeFileSync(output, content)

  return async () => {
    const entries = await originalEntry()

    if (entries['main.js']) {
      entries['main.js'].unshift(output)
    }

    return entries
  }
}


module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, {
      isServer,
      dev,
      buildId,
      defaultLoaders,
      config: {
        distDir
      }
    }) {
      if (!defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        )
      }

      const {registerSW, ...restConfig} = nextConfig

      if (!isServer && !dev) {
        // append server-worker register script to main.js chunk
        if (registerSW) {
          const content = typeof registerSW === 'string' ?
            registerSW : registerScript(defaultRegisterSW)
          config.entry = appendRegisterSW(config.entry, content)
        }

        // push workbox webpack plugin
        config.plugins.push(new NextWorkboxWebpackPlugin({
          ...restConfig,
          distDir,
          buildId,
        }))
      }

      if (typeof restConfig.webpack === 'function') {
        return restConfig.webpack(config, options)
      }

      return config
    }
  })
}
