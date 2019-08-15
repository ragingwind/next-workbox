const withWorkbox = require('next-workbox')

module.exports = withWorkbox({
  generateBuildId: async () => {
    return 'my-build-id';
  }
});
