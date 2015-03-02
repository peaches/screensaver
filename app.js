var restify = require('restify'),
    bunyan = require('bunyan'),
    log = bunyan.createLogger({name: 'screensaver'}),
    images = require('./lib/images');

var server = restify.createServer({
  name: 'screensaver',
  version: ['0.0.1']
});

server.use(restify.queryParser());
server.use(restify.gzipResponse());

server.listen(process.env.PORT || '1234', function() {
  log.info('listening on %s', server.url);
});

server.get('/images/', images.listImages);
server.get(/.*/, restify.serveStatic({
  directory: './dist',
  default: 'index.html'
}));
