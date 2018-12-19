
/*jslint node: true */
/*jshint esversion: 6 */
/*jshint mocha:true */

'use strict';
var expect = require('chai').expect;

var apputils = require ('../src/apputils');


describe('normalizePort(val)', function () {
    it('should normalise sting 3000 to int 3000', function () {
        var port = '3000';
        var normalizedPort = apputils.normalizePort(port);

        expect(normalizedPort).to.be.equal(3000);
    });

    it('should return value of type number', function () {
        var port = '3000';
        var normalizedPort = apputils.normalizePort(port);

        expect(normalizedPort).to.be.a('number');
    });
});