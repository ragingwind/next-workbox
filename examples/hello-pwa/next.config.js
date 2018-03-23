const withWorkbox = require('../../index')

module.exports = withWorkbox({
  workbox: {
    registerSW: true
  }
})
