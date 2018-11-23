/*jslint node: true */
/*jshint esversion: 6 */
/*jshint mocha:true */

'use strict';

var request = require('supertest');
var expect = require('chai').expect;

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
            .expect(function(res){expect(res.header).not.to.have.property('x-powered-by');})
            .end(function (err) {
                if (err)
                    return done(err);
                done();
            });
    });
    
    it('GET / header should contain x-frame-options"', function (done) {
        request(app)
            .get('/')
            .expect(function(res){expect(res.header).to.have.property('x-frame-options');})
            .end(function (err) {
                if (err)
                    return done(err);
                done();
            });
    });

    it('GET / header should contain strict-transport-security"', function (done) {
        request(app)
            .get('/')
            .expect(function(res){expect(res.header).to.have.property('strict-transport-security');})
            .end(function (err) {
                if (err)
                    return done(err);
                done();
            });
    });
    
    it('GET / header should contain content-security-policy"', function (done) {
        request(app)
            .get('/')
            .expect(function(res){expect(res.header).to.have.property('content-security-policy');})
            .end(function (err) {
                if (err)
                    return done(err);
                done();
            });
    });

    it('GET / header should contain referrer-policy"', function (done) {
        request(app)
            .get('/')
            .expect(function(res){expect(res.header).to.have.property('referrer-policy');})
            .end(function (err) {
                if (err)
                    return done(err);
                done();
            });
    });

    it('GET / header should contain feature-policy"', function (done) {
        request(app)
            .get('/')
            .expect(function(res){expect(res.header).to.have.property('feature-policy');})
            .end(function (err) {
                if (err)
                    return done(err);
                done();
            });
    });

});