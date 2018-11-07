/*jslint node: true */
/*jshint esversion: 6 */

/**
 */

'use strict';

var bunyan = require('bunyan');

var logger = bunyan.createLogger({
    name: 'App logger'
});

module.exports = logger;