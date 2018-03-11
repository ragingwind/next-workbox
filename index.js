const NextWorkboxWebpackPlugin = require('next-workbox-webpack-plugin')

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, { isServer, dev, buildId, config: {distDir} }) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        )
      }

      if (!isServer && !dev) {
        config.plugins.push(new NextWorkboxWebpackPlugin({
          distDir,
          buildId,
          ...nextConfig
        }))
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    }
  })
}
