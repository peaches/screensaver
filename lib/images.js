var globby = require('globby');

function listImages(req, res, next) {
  globby(['./dist/images/**/*jpg', './dist/images/**/*png'], function(err, paths) {
    console.log(paths);
    res.send(paths);
    next();
  });
}

module.exports = {
  listImages: listImages
};
