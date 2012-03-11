var http = require('http'),
    connect = require('connect');

var redirect = require('node-force-domain').redirect('silkveiljs.no.de');

var mappings = require('./mappings.js');
var constraints = require('./constraints.js');
var actions = require('./actions.js');

var app = connect();
app.use(redirect);
app.use(function (req, res) {
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
});
http.createServer(app).listen(process.env.PORT || 3000);
