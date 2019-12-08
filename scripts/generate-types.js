const pkg = require('../package.json')
const path = require('path')

require('dts-generator').default({
  project: path.resolve(__dirname, '..'),
  out: path.resolve(__dirname, '..', 'dist', `${pkg.name}.d.ts`)
});
