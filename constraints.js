var moment = require('moment');

var constraints = {
  'validBefore': function (datetime) {
    var now = moment();
    return now.diff(datetime) <= 0;
  },
  'validFrom': function (datetime) {
    var now = moment();
    return now.diff(datetime) >= 0;
  }
};

var verify = function (mapping) {
  if(!mapping.constraints) {
    return mapping;
  }

  for(var constraint in mapping.constraints) {
    if(!mapping.constraints.hasOwnProperty(constraint)) {
      continue;
    }
    if(constraints[constraint].apply({}, mapping.constraints[constraint]) === false) {
      return undefined;
    }
  }

  return mapping;
};

module.exports.verify = verify;
