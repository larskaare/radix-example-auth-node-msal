/*jslint node: true */
/*jshint esversion: 6 */

/**
 * Routing module for application root
 * 
 */

'use strict';
var express = require('express');
var router = express.Router();
var log = require('../src/logger').logger;
var request = require('request');


function doChecking() {
    return new Promise(function(resolve,reject) {
        request('https://graph.microsoft.com/v1.0/me',{json: true}, function (err,res,body) {
            if (err) return reject(err);
                   
            if (res.statusCode == '401') {
                //A 401 (Unauthorized means that the O365 Graph possibile is alive and the app can do it's work
                log.info('monitoring: checking access to O365 Graph to determine if I can reach the web - success');
                resolve({statusCode: res.statusCode});
            } else {
                log.info('monitoring: checking access to O365 Graph to determine if I can reach the web - failure - ' + res.statusCode + ' --> ' + body);
                reject({statusCode: res.statusCode});
            }
        });
    });
}


router.get('/alive', function(req, res) {
    
    log.info('monitoring: /monitoring/alive requested');

    doChecking().then(function () {
        log.info('Serving the liveness probe - alive and ready');
        res.status(200).send('I am alive and ready');
    }).catch(function(err) {
        log.info('Serving the liveness probe - NOT alive and ready --> ' + err);
        res.status(500).send('I am NOT alive and ready');
    });
    
});

module.exports = router;