const glob = require('glob');
const path = require('path');
const svgPath = path.resolve(__dirname, 'assets/svg/fonts/manicon/*.svg');
const svgFiles = glob.sync(svgPath);

module.exports = {
  'files': svgFiles,
  'fontName': 'ManifoldIconFont',
  'classPrefix': 'manicon-',
  'baseClass': 'manicon',
  'fixedWidth': true
};
