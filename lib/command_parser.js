'use strict';

var _ = require('lodash'),
    glympse = require('./glympse'),
    websocket = require('./websocket');

var CMD_GLYMPSE = 'glympse';

var resultWrapper = function(type, result) {
  return JSON.stringify(_.assign({type}, result));
};

var commandTypeFns = {};
commandTypeFns[CMD_GLYMPSE] = (email) => {
  let result = glympse.parse(email);
  if (result.id) {
    let hideGlympse = (cmd) => {
      cmd = _.defaults(cmd, {command: 'hide'});
      websocket.get().clients.forEach((c) => {
        c.send(resultWrapper(CMD_GLYMPSE, cmd));
      });
    };
    glympse.pollCompletion(result.id).then(hideGlympse, hideGlympse);
  }
  return result;
};

function parseCommandFromEmail(email) {
  var commandType = parseSubject(email.subject),
      fn = commandTypeFns[commandType],
      result = fn(email);

  return resultWrapper(commandType, result);
}

function parseSubject(subject) {
  if (subject.search('courtesy of Glympse') > -1) {
    return CMD_GLYMPSE;
  }
}

module.exports = {
  parseCommandFromEmail
};
