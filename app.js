var http = require('http'),
    nowjs = require('now'),
    express = require('express'),
    moment = require('moment'),
    kue = require('kue'),
    amanda = require('amanda'),
    lingua = require('lingua'),
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    piler = require('piler');

var redirect = require('node-force-domain').redirect('silkveiljs.no.de');

var mappings = require('./mappings.js');
var constraints = require('./constraints.js');
var actions = require('./actions.js');
var schemas = require('./schemas.js');

var app = express();
var jobs = kue.createQueue();
var validator = amanda('json');

var clientjs = piler.createJSManager();
var clientcss = piler.createCSSManager();

app.configure(function () {
  clientjs.bind(app);
  clientcss.bind(app);

  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');

  app.use(lingua(app, {
    defaultLocale: 'de-DE',
    path: __dirname + '/i18n'
  }));
  app.use(passport.initialize());

  app.use(redirect);
  app.use(express.static(__dirname + '/public'));
  app.use(deliverDefaultImage());
});

clientjs.addUrl('/nowjs/now.js');
clientjs.addFile(__dirname + '/public/scripts/jquery-1.7.2.min.js');
clientjs.addFile(__dirname + '/public/scripts/jade.min.js');

clientcss.addFile(__dirname + '/public/styles/reset.css');
clientcss.addFile(__dirname + '/public/styles/text.css');
clientcss.addFile(__dirname + '/public/styles/960.css');
clientcss.addFile(__dirname + '/public/styles/core.styl');

var users = {
  golo: 'secret'
};

passport.use(new BasicStrategy(function (userid, password, done) {
  if(!users[userid]) {
    return done(null, false);
  }

  if(users[userid] !== password) {
    return done(null, false);
  }

  done(null, { username: userid });
}));

function deliverDefaultImage() {
  return function (req, res, next) {
    if(req.url.indexOf('/snapshots/') !== 0) {
      return next();
    }
    res.sendfile('empty.png');
  };
}

app.get('/', passport.authenticate('basic', { session: false }), function (req, res) {
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

jobs.process('snapshotCreated', function (job, done) {
  everyone.now.snapshotCreated(job.data.fileName);
  done();
});

nowjs.on('connect', function () {
  var that = this;
  mappings.find(function (err, result) {
    that.now.initialize(result);
  });
});

everyone.now.createMapping = function(mapping) {
  var that = this;

  validator.validate(mapping, schemas[mapping.action], { singleError: false }, function (err) {
    if(err) {
      var fields = {};
      for(var i = 0; i < err.length; i++) {
        var field = err[i].property.substring(Math.max(0, err[i].property.indexOf('.') + 1));
        fields[field] = field;
      }
      that.now.showErrors(fields);
      return;
    }

    that.now.clearInputForm();

    if(mapping.constraints) {
      mapping.constraints.validFrom && (mapping.constraints.validFrom = [
        moment.utc(mapping.constraints.validFrom).toDate()
      ]);
      mapping.constraints.validBefore && (mapping.constraints.validBefore = [
        moment.utc(mapping.constraints.validBefore).toDate()
      ]);
    }
    mappings.create(mapping);

    if(mapping.action === 'redirect') {
      jobs.create('createSnapshot', {
        title: mapping.url,
        url: mapping.url,
        width: 1366,
        height: 768,
        fileName: mapping.alias
      }).save();
    }

    everyone.now.mappingCreated(mapping);
  });
};

everyone.now.deleteMapping = function (alias) {
  mappings.delete(alias);
  everyone.now.mappingDeleted(alias);
};
