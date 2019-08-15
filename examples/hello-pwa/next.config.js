const withWorkbox = require('../../index')

module.exports = withWorkbox({}, {
  generateBuildId: async () => {
    return 'my-build-id';
  }
});
