var express = require('express');
var router = express.Router();
var log = require('../bin/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
  var userDisplayName;

  if (!req.user) {
      userDisplayName = '- "not logged in user"';
  } else {
      userDisplayName = req.user.displayName;
  }
  res.render('index', { title: 'Radix Example Application - Authentication', userDisplayName: userDisplayName, user: req.user});
});

module.exports = router;