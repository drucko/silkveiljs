var http = require('http');

var redirect = require('node-force-domain').redirect('silkveiljs.no.de');

var mappings = require('./mappings.js');
var constraints = require('./constraints.js');
var actions = require('./actions.js');

http.createServer(function (req, res) {
  redirect(req, res);

  var alias = req.url.substring(1);
  var mapping = mappings[alias] || {
    action: 'error',
    statusCode: 404,
    data: 'File not found'
  };

  mapping = constraints.verify(mapping) || {
    action: 'error',
    statusCode: 409,
    data: 'Conflict'
  };

  actions[mapping.action](res, mapping);
}).listen(process.env.PORT || 3000);
