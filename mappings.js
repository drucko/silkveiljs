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
    forceDownload: false
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
