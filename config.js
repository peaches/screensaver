'use strict';

// supports both relative (to app's root) and absolute paths

let _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    configBlob = fs.readFileSync(path.join(__dirname, './config.json.secure'), {encoding: 'utf8'}),
    util = require('./lib/util');

let json = util.decrypt(configBlob),
    config = JSON.parse(json);

console.log(config);

module.exports = _.assign({}, config, {
  root: __dirname,
  imageDir: path.resolve(__dirname, config.imageDir)
});
