/*jslint node: true */
/*jshint esversion: 6 */
/*jshint mocha:true */

'use strict';

var request = require('supertest');

// start app server here 
var app = require('../src/app');


beforeEach(function () {
 
});

// run API test
describe('Testing index router', function () {
    it('GET / when not logged in should return 200', function (done) {
        request(app)
            .get('/')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end(function (err) {
                if (err)
                    return done(err); // if response is 500 or 404 & err, test case will fail
                done();
            });
    });
    it('GET /nowhere should return 404', function (done) {
        request(app)
            .get('/nowhere')
            .expect(404)
            .end(function (err) {
                if (err)
                    return done(err);
                done();
            });
    });
});

// Testing security headers
describe('Testing security headers', function () {
    it('GET / header should not contain x-powered-by', function (done) {
        request(app)
            .get('/')
            .expect(function(res){
                if ('x-powered-by' in res.header) return false;
            })
            .end(function (err) {
                if (err)
                    return done(err);
                done();
            });
    });
    
    it('GET / header should contain x-frame-options"', function (done) {
        request(app)
            .get('/')
            .expect(function(res){if ('x-frame-options' in res.header) return false;})
            .end(function (err) {
                if (err)
                    return done(err);
                done();
            });
    });

    it('GET / header should contain strict-transport-security"', function (done) {
        request(app)
            .get('/')
            .expect(function(res){if ('strict-transport-security' in res.header) return false;})
            .end(function (err) {
                if (err)
                    return done(err);
                done();
            });
    });
    

});