'use strict';

var crypto = require('crypto'),
    algorithm = 'aes256',
    key = process.env.SCREENSAVER_ENCRYPTION_KEY;

function encrypt(txt) {
  let cipher = crypto.createCipher(algorithm, key);
  return cipher.update(txt, 'utf8', 'hex') + cipher.final('hex');
}

function decrypt(encrypted) {
  let decipher = crypto.createDecipher(algorithm, key);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}

module.exports = {encrypt, decrypt};
