/*jslint node: true */
/*jshint esversion: 6 */

/**
 */

'use strict';
var express = require('express');
var router = express.Router();
var log = require('../bin/logger');


/*
 * GET page for information about me object
 */

router.get('/', function(req, res, next) {
    res.render('me', { title: 'Me' });
});

// '/account' is only available to logged in user
// app.get('/me', ensureAuthenticated, function(req, res) {
 
//     res.render('me', { user: req.user });
// });

//
//  more info
//
// app.get('/manager', ensureAuthenticated, function(req, res, next) {
  
 
//     // console.log(users[0]);


//     var client = MicrosoftGraph.Client.init({
//         authProvider: (done) => {
//             done(null, req.user.accessToken); //first parameter takes an error if you can't get an access token
//         }
//     });

//     var manager;

//     client
//         .api('me/manager')
//         .get((err, res) => {
//         // console.log(res); // prints info about authenticated user
        
//             manager = res;
//             console.log('Manager:' + JSON.stringify(manager));
//             req.user.manager = manager;

//             next();
        
//         });
   

// }, function(req, res) { 
 
//     // console.log('Returning manager');  
//     res.status(200).send(JSON.stringify(req.user.manager.displayName));
     
// });



module.exports = router;