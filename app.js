var http = require('http'),
    nowjs = require('now'),
    express = require('express');

var redirect = require('node-force-domain').redirect('silkveiljs.no.de');

var mappings = require('./mappings.js');
var constraints = require('./constraints.js');
var actions = require('./actions.js');

var app = express();

app.configure(function () {
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');

  app.use(redirect);
  app.use(express.static(__dirname + '/public'));
  app.use(require('stylus').middleware({
    src: __dirname + '/public',
    force: true,
    compress: true
  }));
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/:alias', function (req, res) {
  var mapping = mappings.findOne(req.params.alias) || {
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

var server = http.createServer(app).listen(process.env.PORT || 3000);
var everyone = nowjs.initialize(server);

nowjs.on('connect', function () {
  this.now.initialize(mappings.find());
});

everyone.now.deleteMapping = function (alias) {
  mappings.delete(alias);
  everyone.now.mappingDeleted(alias);
};
