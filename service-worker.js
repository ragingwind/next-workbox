const React = require('react')
const {unregisterScript, registerScript} = require('./service-worker-register')

const ServiceWorker = ({src='/sw.js', scope='/', unregister = false, onUpdate = undefined}) => {
  return React.createElement('script', {
      dangerouslySetInnerHTML: {
        __html: unregister ? unregisterScript() : registerScript({src, scope, onUpdate})
      }
    })
}


module.exports = ServiceWorker
