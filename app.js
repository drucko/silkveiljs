var http = require('http');

var redirect = require('redirect')('silkveiljs.com');

var mappings = require('./mappings.js');
var actions = require('./actions.js');

http.createServer(function (req, res) {
  redirect(req, res);

  var alias = req.url.substring(1);
  var mapping = mappings[alias] || {
    action: 'error',
    statusCode: 404,
    data: 'File not found'
  };

  actions[mapping.action](res, mapping);
}).listen(3000);
