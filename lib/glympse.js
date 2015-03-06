'use strict';

var request = require('request'),
    config = require('../config');

function parseGlympseEmail(email) {
  let match = email.text.match(/http.*?glympse.com\/(.{4}-.{4})/);
  if (match && match.length > 1) {
    let url = match[0], id = match[1];
    return {command: 'show', url, id};
  }
}

function pollCompletion(id, opt_interval) {
  return new Promise((resolve, reject) => {
    let intervalId = setInterval(() => {
      let glympse = config.glympse,
          url = `${glympse.url}/${id}?oauth_token=${glympse.token}`,
          cmd = {command: 'hide', id};

      request.get({url, json:true}, (err, req, status) => {
        if (err) {
          clearInterval(intervalId);
          console.log('error: ', err);
          return resolve(cmd);
        }

        if (status.result === "ok") {
          let props = status.response.properties;
          let result = props.filter(p => p.n === 'completed');
          if (result[0] && result[0].v === true) {
            clearInterval(intervalId);
            resolve(cmd);
          }
        } else {
          // assume expired, cancel
          clearInterval(intervalId);
          resolve(cmd);
        }
      });
    }, opt_interval || 60000);
  });
}

module.exports = {
  parse: parseGlympseEmail,
  pollCompletion
};
