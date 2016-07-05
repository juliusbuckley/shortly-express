var request = require('request');
var nJwt = require('njwt');
var Cookies = require('cookies');
var uuid = require('uuid');

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

var signingKey = uuid.v4();

exports.createCookie = function(model, req, res) {
  var claims = {
    iss: 'http://127.0.0.1',
    sub: model.attributes.username
  };

  var jwt = nJwt.create(claims, signingKey);
  var token = jwt.compact();

  new Cookies(req, res).set('access_token', token, { httpOnly: true});
};

exports.checkUser = function(req, res, next) {
  var token = new Cookies(req, res).get('access_token');
  nJwt.verify(token, signingKey, function(err, token) {
    if (err) {
      console.log('fail', err);
      res.setHeader('location', '/');
      res.redirect('/');
    } else {
      console.log('verified');
      next();
    }
  });
};

exports.test = function(req, res, next) {
  console.log('middleware working');
  next();
};

/************************************************************/
// Add additional utility functions below
/************************************************************/
