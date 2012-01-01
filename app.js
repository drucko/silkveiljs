var http = require('http');

var mappings = require('./mappings');
var actions = require('./actions');

http.createServer(function (req, res) {
  var alias = req.url.substring(1);
  var mapping = mappings[alias] || {
    action: 'error',
    statusCode: 404,
    data: 'File not found'
  };

  actions[mapping.action](res, mapping);
}).listen(3000);
