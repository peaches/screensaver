'use strict';

var inbox = require('inbox'),
    MailParser = require("mailparser").MailParser,
    mailparser = new MailParser(),
    config = require('../config'),
    websocket = require('./websocket'),
    log = require('./log'),
    commandParser = require('./command_parser'),
    imapClient;

function newClient() {
  var client = inbox.createConnection(false, config.imap.host, {
    secureConnection: config.imap.secure,
    auth:{
      user: config.imap.email,
      pass: config.imap.password
    }
  });

  client.on('connect', () => {
    client.openMailbox('INBOX', (error, info) => {
      if(error) throw error;
    });
  });

  client.on('new', (message) => {
    var msgStream = client.createMessageStream(message.UID);

    msgStream.pipe(new MailParser())
      .on('end', (mail) => {
        let result = commandParser.parseCommandFromEmail(mail);

        log.info('Sending command to clients');
        websocket.get().clients.forEach((client) => {
          client.send(result);
        });
      });
  });

  client.connect();
  return client;
}

module.exports = {
  connect: () => {
    if (!imapClient) {
      imapClient = newClient();
    }
    return imapClient;
  }
};
