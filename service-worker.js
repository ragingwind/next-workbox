import React from 'react'
import {unregisterScript, registerScript} from './service-worker-register'

const ServiceWorker = ({src='/sw.js', scope='/', unregister = false, onUpdate = undefined}) => {
  return React.createElement('script', {
      dangerouslySetInnerHTML: {
        __html: unregister ? unregisterScript() : registerScript({src, scope, onUpdate})
      }
    })
}

export default ServiceWorker
