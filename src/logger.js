/*jslint node: true */
/*jshint esversion: 6 */

/**
 * We are using bunyan as the logger for the express middleware. 
 * This module defines the bunyan logger which can be used elsewhere in the application - instead of console.log statements
 */

'use strict';

var bunyan = require('bunyan');

var logger = bunyan.createLogger({
    name: 'App logger'
});

module.exports = logger;