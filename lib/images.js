var globby = require('globby'),
    config = require('../config.json'),
    log = require('./log');

function listImages(req, res, next) {
  var patterns = ['jpg', 'png', 'gif'].map((p) => {
    return `${config.imageDirectory}/**/*${p}`;
  });
  console.log(patterns);

  globby(patterns, function(err, paths) {
    if (err) {
      return next(err);
    }

    log.info(`Found ${paths.length} images`);
    res.send(paths);
    next();
  });
}

module.exports = {
  listImages: listImages
};
