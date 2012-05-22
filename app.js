var http = require('http'),
    nowjs = require('now'),
    express = require('express'),
    moment = require('moment');

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
  mappings.findOne(req.params.alias, function (err, result) {
    var mapping = result || {
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
});

var server = http.createServer(app).listen(process.env.PORT || 3000);
var everyone = nowjs.initialize(server);

nowjs.on('connect', function () {
  var that = this;
  mappings.find(function (err, result) {
    that.now.initialize(result);
  });
});

everyone.now.createMapping = function(mapping) {
  if(mapping.constraints) {
    mapping.constraints.validFrom && (mapping.constraints.validFrom = [
      moment.utc(mapping.constraints.validFrom).toDate()
    ]);
    mapping.constraints.validBefore && (mapping.constraints.validBefore = [
      moment.utc(mapping.constraints.validBefore).toDate()
    ]);
  }
  mappings.create(mapping);
  everyone.now.mappingCreated(mapping);
};

everyone.now.deleteMapping = function (alias) {
  mappings.delete(alias);
  everyone.now.mappingDeleted(alias);
};
