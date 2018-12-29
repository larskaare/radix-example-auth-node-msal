/*jslint node: true */
/*jshint esversion: 6 */

/**
 * We are using bunyan as the logger for the express middleware. 
 * This module defines the bunyan logger which can be used elsewhere in the application - instead of console.log statements
 *
 * We have pre-defined 3 levels of logging, error, warn and info. Depeding on scenario, we could use
 * multiple loggers and streams.
 */

'use strict';

const logConfig = require('../config/config').logging;
var bunyan = require('bunyan');

function enableLogzIo() {
    if ((process.env.LOGZIO !== 'undefined' && process.env.LOGZIO === 'true') || logConfig.logzio === 'true') {
        return true;
    } else {
        return false;
    }
}


//Defining logs for local - stdout
var loggerLocal = bunyan.createLogger({
    name: 'Local',
    streams: [
        {
            stream: process.stdout
        }
    ]
});

if (enableLogzIo()) {
    //Configuring transport to LogzIO
    loggerLocal.info('Configuring logging to LogzIO');

    var logzioBunyanStream = require('logzio-bunyan');

    //Defining logging for Logzio
    var logzioLoggerOptions = {
        token: (process.env.LOGZTOKEN || ''),
        protocol: 'https'
    };
    var logzioStream = new logzioBunyanStream(logzioLoggerOptions);
    var loggerLogzIo = bunyan.createLogger({
        name: 'LogzIO',
        streams: [
            {
                type: 'raw',
                stream: logzioStream
            }
        ]
    });
}

function errorLogger (string) {
    if (enableLogzIo()) loggerLogzIo.error(string);
    loggerLocal.error(string); 
}

function warnLogger (string) {
    if (enableLogzIo()) loggerLogzIo.warn(string);
    loggerLocal.warn(string); 
}

function infoLogger (string) {
    if (enableLogzIo()) loggerLogzIo.info(string);
    loggerLocal.info(string); 
}

module.exports.logger = {
    error: function(string) {
        errorLogger(string);
    },
    warn: function(string) {
        warnLogger(string);
    },
    info: function(string) {
        infoLogger(string);
    }
};

/**
 * We are using bunyan as the logger for the express middleware. 
 * Removing headers and bodies - as these could contain a lot of privacy
 * related stuff. Adding a few attribues to indicate if request had cookies
 * or the response tried to set-cookies - for the example
 */

module.exports.mlogger = function (req,res,next) {
    
    //Defining streams for middleware logger, local or local + LogzIO
    var mStreams;

    if (enableLogzIo()) {
        mStreams =  [{
            level: logConfig.expressLogLevel,
            stream: process.stdout,
            type:'stream'
        },{
            level: logConfig.expressLogLevel,
            type: 'raw',
            stream: logzioStream
        }];
    } else {
        mStreams =  [{
            level: logConfig.expressLogLevel,
            stream: process.stdout,
            type:'stream'
        }];
    }

    var logger = require('express-bunyan-logger')({
        name: 'Express',
        streams: mStreams,
        includesFn: function (req,res) {
            return {
                requestHasCookies: (req.cookies?'true':'false'),
                responseSetCookies: ('set-cookie' in res._headers?'true':'false')
            };
        },
        excludes: ['res','req','req-headers','res-headers','body','user-agent','response-hrtime'],
        parseUA: false    
    });
   
    logger(req,res, next);
    
};
