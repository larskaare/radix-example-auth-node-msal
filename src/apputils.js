/*jslint node: true */
/*jshint esversion: 6 */

/**
 * We are using bunyan as the logger for the express middleware. 
 * This module defines the bunyan logger which can be used elsewhere in the application - instead of console.log statements
 */

'use strict';

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
    // named pipe
        return val;
    }

    if (port >= 0) {
    // port number
        return port;
    }

    return false;
}

module.exports = {normalizePort};