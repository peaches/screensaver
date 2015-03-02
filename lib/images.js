var glob = require('glob'),
    path = require('path'),
    config = require('../config'),
    imageDir = config.imageDir,
    log = require('./log');

function listImages(req, res, next) {
  var pattern = ['jpg', 'png', 'gif'].join(','),
      globPattern = `${imageDir}/**/*{${pattern}}`,
      options = {nocase: true};

  glob(globPattern, options, function(err, paths) {
    if (err) {
      return next(err);
    }

    log.info(`Found ${paths.length} images`);
    if (paths) {
      paths = paths.map((p) => {
        return path.relative(imageDir, p);
      });
    }
    res.send(paths);
    next();
  });
}

module.exports = {
  listImages: listImages
};
