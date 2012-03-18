var http = require('http'),
    express = require('express');

var redirect = require('node-force-domain').redirect('silkveiljs.no.de');

var mappings = require('./mappings.js');
var constraints = require('./constraints.js');
var actions = require('./actions.js');

var app = express();

app.configure(function () {
  app.use(redirect);
});

app.get('/:alias', function (req, res) {
  var mapping = mappings[req.params.alias] || {
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
});
http.createServer(app).listen(process.env.PORT || 3000);
