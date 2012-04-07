var moment = require('moment');

var mappings = [
  {
    alias: 'goloroden',
    action: 'redirect',
    url: 'http://www.goloroden.de/',
    type: 'permanent'
  }, {
    alias: 'google',
    action: 'redirect',
    url: 'http://www.google.de/',
    type: 'permanent'
  }, {
    alias: 'polarbear',
    action: 'download',
    url: 'http://www.goloroden.de/images/Logo.png',
    fileName: 'PolarBear.png',
    contentType: 'image/png',
    forceDownload: false,
    constraints: {
      validFrom: [ moment.utc([2012, 0, 1]).toDate() ],
      validBefore: [ moment.utc([2012, 11, 31, 23, 59, 59]).toDate() ]
    }
  }, {
    alias: 'portrait',
    action: 'download',
    url: 'file://./Golo-Roden.jpg',
    fileName: 'Portrait.jpg',
    contentType: 'image/jpeg',
    forceDownload: false
  }
];

var store = {
  find: function () {
    return mappings;
  },

  findOne: function (alias) {
    for(var i = 0, len = mappings.length; i < len; i++) {
      if(mappings[i].alias === alias) {
        return mappings[i];
      }
    }
    return undefined;
  }
};

module.exports = store;
