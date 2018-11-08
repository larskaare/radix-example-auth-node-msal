/*jslint node: true */
/*jshint esversion: 6 */

/**
 * A module for various authentication logics that potentially will be used a lot all over
 */

'use strict';

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
};

