/*jslint node: true */
/*jshint esversion: 6 */

/**
 * Routing module for application root
 * 
 */

'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var userDisplayName;

    if (!req.user) {
        userDisplayName = '- "not logged in user"';
    } else {
        userDisplayName = req.user.displayName;
    }
    
    res.render('index', { title: 'Radix Example Application - Authentication', userDisplayName: userDisplayName, user: req.user});

});

module.exports = router;