var http = require('http'),
    restify = require('restify'),
    connect = require('connect'),
    bunyan = require('bunyan'),
    config = require('./config'),
    log = require('./lib/log'),
    images = require('./lib/images'),
    serveStatic = require('serve-static'),
    port = process.env.PORT || 1234,
    websocket = require('./lib/websocket'),
    imap = require('./lib/imap');

var server = restify.createServer({
  name: 'screensaver',
  version: ['0.0.1']
});

server.use(restify.queryParser());
server.use(restify.gzipResponse());

log.info('image dir is: ', config.imageDir);
server.get('/images', images.listImages);

var connectApp = connect()
  .use('/', serveStatic(__dirname + '/dist'))
  .use('/images/', serveStatic(config.imageDir))
  .use('/api', function (req, res) {
    server.server.emit('request', req, res);
  });

var httpServer = http.createServer(connectApp);
websocket.get(httpServer);
httpServer.listen(port);

imap.connect();
