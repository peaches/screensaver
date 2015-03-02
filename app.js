var restify = require('restify'),
    connect = require('connect'),
    bunyan = require('bunyan'),
    config = require('./config'),
    log = require('./lib/log'),
    images = require('./lib/images'),
    serveStatic = require('serve-static');

var server = restify.createServer({
  name: 'screensaver',
  version: ['0.0.1']
});

server.use(restify.queryParser());
server.use(restify.gzipResponse());

logger.info('image dir is: ', config.imageDir);
server.get('/images', images.listImages);

var connectApp = connect()
    .use('/', serveStatic(__dirname + '/dist'))
    .use('/images/', serveStatic(config.imageDir))
    .use("/api", function (req, res) {
             server.server.emit('request', req, res);
         });
 
connectApp.listen(process.env.PORT || 1234);
