var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  initialize: function() {
    this.on('creating', this.hashGenerator, this);
  },

  hashGenerator: function(model, attrs, options) {
    return new Promise(function(resolve, reject) {
      bcrypt.hash(model.attributes.password, model.attributes.createdAt, null, function(err, hash) {
        if (err) {
          reject(err);
        }
        model.set('password', hash);
        resolve(hash);
      });
    });
  }

});

module.exports = User;