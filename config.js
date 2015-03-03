// supports both relative (to app's root) and absolute paths
var IMAGE_DIR = '/media/screensaver';


var path = require('path');

module.exports = {
  root: __dirname,
  imageDir: path.resolve(__dirname, IMAGE_DIR)
};
