/*jslint node: true */
/*jshint esversion: 6 */
/*jshint mocha:true */

'use strict';

var request = require('supertest');

// start app server here 
var app = require('../src/app');


beforeEach(function () {
    //
});

// run API test
describe('Testing me router', function () {
    it('GET /me when not logged in should return 302', function (done) {
        request(app)
            .get('/me')
            .expect(302)
            .expect('Content-Type', 'text/plain; charset=utf-8')
            .end(function (err) {
                if (err)
                    return done(err); // if response is 500 or 404 & err, test case will fail
                done();
            });
    });

});