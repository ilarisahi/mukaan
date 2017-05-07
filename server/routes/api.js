'use strict';
const express = require('express');
const router = express.Router();
var winston = require('winston');
var passport = require('passport');
var db_queries = require('../db').queries;
var User = require('../User');
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'secRET',
    userProperty: 'user'
});
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mukaan.sqlite3', function (err) {
    if (err)
        winston.error(err);
});


/* GET api listing. */
router.get('/', function(req, res) {
    res.send('api works');
    
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        var token;
        if (err) {
            res.status(404).send(err);
            return;
        }

        if (user) {
            var u;
            if (user.group === 'admin') {
                u = new User(user.id, 'Adam', 'Admin', '05050', user.group);
            } else if (user.group === "employee") {
                u = new User(user.id, 'Emma', 'Employee', '04040', user.group);
            } else {
                db.serialize(function () {
                    db.get(db_queries[1], user.id, function (err, row) {
                        u = new User(user.id, row.first_name, row.last_name, row.phone, user.group);
                    });
                });
            }
            winston.info('logged in as: ' + u);
            token = u.generateJwt();
            res.status(200).send({
                "token": token
            });
        } else {
            res.status(401).send(info);
        }
    })(req, res, next);
});

router.get('/profile', auth, function (req, res, next) {
    winston.info(req.user);
    if (!req.user.id) {
        res.status(401).send({ error: "Unauthorized user" });
    } else {
        if (req.user.group === 'admin') {
            res.status(200).send(new User(req.user.id, 'Adam', 'Admin', '05050', req.user.group));
        } else if (req.user.group === "employee") {
            res.status(200).send(new User(req.user.id, 'Emma', 'Employee', '04040', req.user.group));
        } else {
            db.serialize(function () {
                db.get(db_queries[1], req.user.id, function (err, row) {
                    res.status(200).send(new User(req.user.id, row.first_name, row.last_name, row.phone, req.user.group));
                });
            });
        }
    }
});

router.get('/events', function (req, res, next) {
    db.serialize(function () {
        db.all(db_queries[0], function (err, rows) {
            if (err)
                winston.error(err);
            res.send(rows);
        });
    });
});

module.exports = router;