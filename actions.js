var http = require('http');
var fs = require('fs');
var url = require('url');

var deliverDownload = function (res, mapping, data) {
  var contentDisposition = mapping.forceDownload ? 'attachment' : 'inline';
  res.writeHead(data.statusCode, {
    'Content-Type': mapping.contentType,
    'Content-Disposition': contentDisposition + '; filename=' + mapping.fileName + ';'
  });
  data.pipe(res);
};

var actions = {
  'download': function (res, mapping) {
    var options = url.parse(mapping.url);
    switch(options.protocol) {
      case 'http:':
        http.get(options, function (data) {
          deliverDownload(res, mapping, data);
        });
        break;
      case 'file:':
        var data = fs.createReadStream(options.host + options.path);
        data.statusCode = 200;
        deliverDownload(res, mapping, data);
        break;
    }
  },
  'error': function (res, mapping) {
    res.send(mapping.statusCode, mapping.statusCode + ' ' + mapping.data);
  },
  'redirect': function (res, mapping) {
    res.redirect(mapping.type === 'permanent' ? 301 : 307, mapping.url);
  }
};

module.exports = actions;
