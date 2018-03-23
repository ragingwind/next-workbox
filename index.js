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
    webpack(config, options) {
			const {
				isServer,
				dev,
				buildId,
				defaultLoaders,
				config: {
					distDir
				}
			} = options

      if (!defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        )
			}

      const {webpack, workbox = {}} = nextConfig

      if (!isServer && !dev) {
        // append server-worker register script to main.js chunk
        if (workbox.registerSW) {
					const content = typeof workbox.registerSW === 'string' ?
						workbox.registerSW : registerScript(defaultRegisterSW)
          config.entry = appendRegisterSW(config.entry, content)
        }

        // cleanup params
        delete workbox.registerSW

        // push workbox webpack plugin
        config.plugins.push(new NextWorkboxWebpackPlugin({
          ...workbox,
          distDir,
          buildId,
        }))
      }

      if (typeof webpack === 'function') {
        return webpack(config, options)
      }

      return config
    }
  })
}
