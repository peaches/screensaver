var WebSocketServer = require('ws').Server,
    wss;

function createServer(srv) {
  var server = new WebSocketServer({server: srv});

  server.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });
  });

  return server;
}

module.exports = {
  get: function(srv) {
    if (!wss && srv) {
      wss = createServer(srv);
    }
    return wss;
  }
};
