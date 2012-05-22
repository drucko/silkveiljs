var mongo = require('mongoskin'),
    db = mongo.db('mongo://localhost/silkveiljs?auto_reconnect=true');

db.bind('mappings');
db.mappings.ensureIndex({ alias: 1 });

var store = {
  find: function (callback) {
    db.mappings.findItems(callback);
  },

  findOne: function (alias, callback) {
    db.mappings.findOne({ alias: alias }, callback)
  },

  create: function (mapping) {
    db.mappings.save(mapping);
  },

  delete: function (alias) {
    db.mappings.remove({ alias: alias });
  }
};

module.exports = store;
