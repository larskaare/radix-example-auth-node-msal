/*jslint node: true */
/*jshint esversion: 6 */

/**
 * Routing module for '/me'
 * 
 * '/' - hit the o365 graph api and collect some information from the me and manager endpoints
 * 
 */

'use strict';
var express = require('express');
var router = express.Router();
const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
var log = require('../src/logger').logger;
var authUtil = require('../src/authutil');

/*
 * GET page for information about me object
 */

router.get('/', authUtil.ensureAuthenticated,  function(req, res, next) {
 
    //Collecting information from the /me/manager endpoint
    var client = MicrosoftGraph.Client.init({
        authProvider: (done) => {
            done(null, req.user.accessToken); //first parameter takes an error if you can't get an access token
        }
    });


    client
        .api('me/manager')
        .get((err, res) => {
            log.info('Collecting manager for user ' + req.user.sub);
            req.user.manager = res;
            next();     
        });

}, function(req,res,next) {

    //Collecting information from the /me endpoint
    var client = MicrosoftGraph.Client.init({
        authProvider: (done) => {
            done(null, req.user.accessToken); //first parameter takes an error if you can't get an access token
        }
    });

    client
        .api('me')
        .get((err, res) => {
            log.info('Collecting me for user ' + req.user.sub);
            req.user.me = res;
            next();     
        });
}, function(req, res) { 
    var meObj={};

    meObj.displayName = '';
    meObj.jobTitle = '';
    meObj.mail = '';
    meObj.phone = '';
    meObj.officeLocation = '';
    meObj.manager = '';

    if (req.user.me) {
        meObj.displayName = req.user.me.displayName;
        meObj.jobTitle = req.user.me.jobTitle;
        meObj.mail = req.user.me.mail;
        meObj.phone = req.user.me.mobilePhone;
        meObj.officeLocation = req.user.me.officeLocation;
    }

    if (req.user.manager) {
        meObj.manager = req.user.manager.displayName;
    }

    res.render('me', { title: 'O365 Graph information about you', me: meObj });
});

module.exports = router;