'use strict';

var _ = require('lodash'),
    glympse = require('./glympse');

var CMD_GLYMPSE = 'glympse';

var resultWrapper = function(type, result) {
  return JSON.stringify(_.assign({type}, result));
};

var commandTypeFns = {};
commandTypeFns[CMD_GLYMPSE] = glympse.parse;

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
