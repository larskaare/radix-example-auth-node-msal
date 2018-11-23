/*jslint node: true */
/*jshint esversion: 6 */

/**
 * Rigging web app middleware and handling most of the authentication logic
 * 
 */

'use strict';


/******************************************************************************
 * Module dependencies.
 *****************************************************************************/
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var helmet = require('helmet');
var config = require('../config/config');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
var log = require('../src/logger');

// Reading vital config from environment variables
//
const localConfig={};

localConfig.IDENTITYMETADATA = (process.env.IDENTITYMETADATA || config.creds.identityMetadata);
localConfig.CLIENTID = (process.env.CLIENTID || config.creds.clientID);
localConfig.REDIRECTURL = (process.env.REDIRECTURL || config.creds.redirectUrl);
localConfig.CLIENTSECRET = (process.env.CLIENTSECRET || config.creds.clientSecret);
localConfig.DESTROYSESSIONURL = (process.env.DESTROYSESSIONURL || config.destroySessionUrl);

/******************************************************************************
 * Set up passport in the app 
 ******************************************************************************/

//-----------------------------------------------------------------------------
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.  Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
//-----------------------------------------------------------------------------
passport.serializeUser(function(user, done) {
    done(null, user.oid);
});

passport.deserializeUser(function(oid, done) {
    findByOid(oid, function (err, user) {
        done(err, user);
    });
});

// array to hold logged in users
var users = [];

var findByOid = function(oid, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        log.info('we are using user: ', user.sub);
        if (user.oid === oid) {
            return fn(null, user);
        }
    }
    return fn(null, null);
};

//-----------------------------------------------------------------------------
// Use the OIDCStrategy within Passport.
// 
// Strategies in passport require a `verify` function, which accepts credentials
// (in this case, the `oid` claim in id_token), and invoke a callback to find
// the corresponding user object.
// 
// The following are the accepted prototypes for the `verify` function
// (1) function(iss, sub, done)
// (2) function(iss, sub, profile, done)
// (3) function(iss, sub, profile, access_token, refresh_token, done)
// (4) function(iss, sub, profile, access_token, refresh_token, params, done)
// (5) function(iss, sub, profile, jwtClaims, access_token, refresh_token, params, done)
// (6) prototype (1)-(5) with an additional `req` parameter as the first parameter
//
// To do prototype (6), passReqToCallback must be set to true in the config.
//-----------------------------------------------------------------------------
passport.use(new OIDCStrategy({
    identityMetadata: localConfig.IDENTITYMETADATA,
    clientID: localConfig.CLIENTID,
    responseType: config.creds.responseType,
    responseMode: config.creds.responseMode,
    redirectUrl: localConfig.REDIRECTURL,
    allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
    clientSecret: localConfig.CLIENTSECRET,
    validateIssuer: config.creds.validateIssuer,
    isB2C: config.creds.isB2C,
    issuer: config.creds.issuer,
    passReqToCallback: config.creds.passReqToCallback,
    scope: config.creds.scope,
    loggingLevel: config.creds.loggingLevel,
    loggingNoPII: config.creds.loggingNoPII,
    nonceLifetime: config.creds.nonceLifetime,
    nonceMaxAmount: config.creds.nonceMaxAmount,
    useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
    cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
    clockSkew: config.creds.clockSkew,
},
function(iss, sub, profile, accessToken, refreshToken, done) {
    
    // users.push(accessToken);
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    
    if (!profile.oid) {
        return done(new Error('No oid found'), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
        findByOid(profile.oid, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                // "Auto-registration"
                users.push(profile);
                return done(null, profile);
            }
            return done(null, user);
        });
    });
}
));


//-----------------------------------------------------------------------------
// Config the app, include middlewares
//-----------------------------------------------------------------------------

var indexRouter = require('../routes/index');
var meRouter = require('../routes/me');

var app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

//Defining logger
app.use(require('express-bunyan-logger')({
    name: 'logger',
    streams: [{
        level: config.creds.loggingLevel,
        stream: process.stdout
    }]
}));

// app.use(logger('dev'));
app.use(express.json());

//Defining security headers
app.use(helmet());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

app.use('/', indexRouter);
app.use('/me', meRouter);

//
// Handling Authentication and login's  
//

app.get('/login',
    function(req, res, next) {
        passport.authenticate('azuread-openidconnect', 
            { 
                response: res,                      // required
                resourceURL: config.resourceURL,    // optional. Provide a value if you want to specify the resource.
                customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
                failureRedirect: '/' 
            }
        )(req, res, next);
    },
    function(req, res) {
        res.redirect('http://localhost:3000');
    });

// 'GET returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// query (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
app.get('/auth/openid/return',
    function(req, res, next) {
        passport.authenticate('azuread-openidconnect', 
            { 
                response: res,                      // required
                failureRedirect: '/'  
            }
        )(req, res, next);
    },
    function(req, res) {
        log.info('We received a return from AzureAD.');
        res.redirect('/');
    });

// 'POST returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// body (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
app.post('/auth/openid/return',
    function(req, res, next) {
        passport.authenticate('azuread-openidconnect', 
            { 
                response: res,                      // required
                failureRedirect: '/'  
            }
        )(req, res, next);
    },
    function(req, res) {
        log.info('We received a return from AzureAD.');
        res.redirect('/');
    });

// 'logout' route, logout from passport, and destroy the session with AAD.
app.get('/logout', function(req, res){
    req.session.destroy(function() {
        req.logOut();
        res.redirect(localConfig.DESTROYSESSIONURL);
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
  
module.exports = app;
