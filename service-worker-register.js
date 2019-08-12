// Service Worker snippets from https://github.com/codebusking/vue-hn-pwa-guide-kit/tree/master/build
// all of comments was removed to convenience reason

const unregisterScript = unregister => `
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister();
    console.log('ServiceWorker has been unregistered')
  })
}`;

const registerScript = ({ src, scope, onUpdate }) => `
const allowsSW = Boolean(window.location.protocol === 'https:' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
)

window.addEventListener('load', function() {
  if ('serviceWorker' in navigator && allowsSW) {
    navigator.serviceWorker.register('${src}', {scope: '${scope}'})
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');
                typeof ${onUpdate} === 'function' && ${onUpdate}('refresh')
              } else {
                console.log('Content is cached for offline use.');
                typeof ${onUpdate} === 'function' && ${onUpdate}('cached')
              }
            }
          }
        }
      }).catch(function(e) {
        console.error('Error during service worker registration:', e)
      })
  }
})
`;
module.exports = {
  unregisterScript,
  registerScript
};
