'use strict';

function parseGlympseEmail(email) {
  let match = email.text.match(/http.*?glympse.com\/(.{4}-.{4})/);
  if (match && match.length > 1) {
    let url = match[0], id = match[1];
    return {command: 'show', url, id};
  }
}

module.exports = {
  parse: parseGlympseEmail
};
