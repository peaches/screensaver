var fs = require('fs'),
    util = require('../lib/util');

if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' <file_to_encrypt> <output>');
  return;
}

var content = fs.readFileSync(process.argv[2], {encoding: 'utf8'}),
    encrypted = util.encrypt(content);

fs.writeFileSync(process.argv[3], encrypted);
