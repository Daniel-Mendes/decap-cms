const os = require('node:os');
const path = require('node:path');
const cache = require('cache-me-outside');

cache({
  cacheFolder: path.join('/', 'opt', 'build', 'cache', 'fast-cache'),
  contents: [
    {
      path: path.join(os.homedir(), '.cache', 'Cypress'),
      invalidateOn: __filename,
      command: 'echo noop',
    },
  ],
  ignoreIfFolderExists: false,
});
