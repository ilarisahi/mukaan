'use strict';
var debug = require('debug')('Mukaan');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var winston = require('winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var fs = require('fs');

const api = require('./server/routes/api');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up passport
app.use(passport.initialize());

// Set our api routes
app.use('/api', api);
app.use(express.static(path.join(__dirname, '/dist')));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// Catch all other routes and return the index file
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        winston.error(err.stack);
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    winston.error(err.stack);
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
