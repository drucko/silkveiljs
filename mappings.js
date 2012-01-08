var moment = require('moment');

var mappings = {
  'goloroden': {
    action: 'redirect',
    url: 'http://www.goloroden.de/',
    type: 'permanent'
  },
  'polarbear': {
    action: 'download',
    url: 'http://www.goloroden.de/images/Logo.png',
    fileName: 'PolarBear.png',
    contentType: 'image/png',
    forceDownload: false,
    constraints: {
      validFrom: [ moment(Date.UTC.apply({}, [2012, 0, 1])) ],
      validBefore: [ moment(Date.UTC.apply({}, [2012, 11, 31, 23, 59, 59])) ]
    }
  },
  'portrait': {
    action: 'download',
    url: 'file://./Golo-Roden.jpg',
    fileName: 'Portrait.jpg',
    contentType: 'image/jpeg',
    forceDownload: false
  }
};

module.exports = mappings;
