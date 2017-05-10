'use strict';
const express = require('express');
const router = express.Router();
var winston = require('winston');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db_queries = require('../db').queries;
var User = require('../User');
var fs = require('fs');
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

var users = {};

fs.readFile('./server/auth.json', 'utf-8', function(err, data) {
    if (err) {
        winston.error(err);
    } else {
        users = JSON.parse(data);
        winston.info(users);
    }
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    function(username, password, done) {
        winston.info('logging in: ' + username + ' : ' + password);
        if (users.hasOwnProperty(username)) {
            var user = users[username];
            if (user.password === password) {
                winston.info('authenticated user: ' + user.id);
                user.username = username;
                return done(null, user);
            }
        }

        return done(null, false, {
            message: 'Wrong username or password'
        });
    }
));

/* GET api listing. */
router.get('/', function(req, res) {
    res.send('api works');
    
});

router.post('/register', function(req, res, next) {
    winston.info(users);
    var user = new User(null, req.body.first_name, req.body.last_name, req.body.phone, 'client');

    if (users.hasOwnProperty(req.body.username)) {
        return res.status(500).send({ message: 'registration failed' });
    }

    db.serialize(function() {
        db.run(db_queries[2], req.body.first_name, req.body.last_name, req.body.phone, function(err) {
            if (err) {
                winston.log(err);
                res.status(500).send({ message: 'error' });
            } else {
                user.id = this.lastID;
                user.username = req.body.username;
                user.group = "client";

                users[req.body.username] = {
                    id: user.id,
                    password: req.body.password,
                    group: 'client'
                };

                winston.info(users);

                fs.writeFile('./server/auth.json', JSON.stringify(users), 'utf8', function(err) {
                    if (err) {
                        winston.error(err)
                        res.status(500).send({ message: 'error' });
                    } else {
                        winston.info('logged in as ' + user);
                        var token = user.generateJwt();
                        res.status(200).send({
                            "token": token
                        });
                    }
                });
            }            
        });
    });

});

router.post('/login', function(req, res, next) {
    winston.info('logging in ' + req.username + ' : ' + req.password);
    passport.authenticate('local', function (err, user, info) {
        var token;
        if (err) {
            winston.error(err);
            res.status(404).send(err);
            return;
        }

        if (user) {
            var u;
            if (user.id === 1) {
                u = new User(user.id, 'admin', 'Adam', 'Admin', '05050', user.group);
                winston.info('logged in as: ' + u);
                token = u.generateJwt();
                res.status(200).send({
                    "token": token
                });
            } else if (user.id === 2) {
                u = new User(user.id, 'employee', 'Emma', 'Employee', '04040', user.group);
                winston.info('logged in as: ' + u);
                token = u.generateJwt();
                res.status(200).send({
                    "token": token
                });
            } else {
                db.serialize(function() {
                    db.get(db_queries[1], user.id, function(err, row) {
                        let u = new User();
                        u.id = user.id;
                        u.username = user.username;
                        u.first_name = row.first_name;
                        u.last_name = row.last_name;
                        u.phone = row.phone;
                        u.group = user.group;
                        winston.info('logged in as: ' + u);
                        token = u.generateJwt();
                        res.status(200).send({
                            "token": token
                        });
                    });
                });
            }
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
        if (req.user.id === '1') {
            res.status(200).send(new User(req.user.id, 'admin', 'Adam', 'Admin', '05050', 'admin'));
        } else if (req.user.id === "2") {
            res.status(200).send(new User(req.user.id, 'employee', 'Emma', 'Employee', '04040', 'employee'));
        } else {
            db.serialize(function () {
                db.get(db_queries[1], req.user.id, function (err, row) {
                    let u = new User();
                    u.id = req.user.id;
                    u.username = req.user.username;
                    u.first_name = row.first_name;
                    u.last_name = row.last_name;
                    u.phone = row.phone;
                    u.group = req.user.group;
                    console.log(u);
                    res.status(200).send(u);
                });
            });
        }
    }
});

router.put('/profile', auth, function (req, res, next) {
    if (!req.user.id) {
        return res.status(401).send({ error: "Unauthorized user" });
    } else {
        winston.info('REQ USER: ' + req.user.username);
        users[req.user.username].group = req.body.group;

        winston.info(users);

        fs.writeFile('./server/auth.json', JSON.stringify(users), 'utf8', function (err) {
            if (err) {
                winston.error(err)
                return res.status(500).send({ message: 'error' });
            } else {
                if (req.user.id != 1 || req.user.id != 2) {
                    db.serialize(function () {
                        db.run(db_queries[4], req.body.first_name, req.body.last_name, req.body.phone, req.user.id, function (err) {
                            if (err) {
                                winston.log(err);
                                return res.status(500).send({ message: 'error' });
                            }
                        });
                    });
                }
                let u = new User();
                u.id = req.user.id;
                u.username = req.user.username;
                u.first_name = req.body.first_name;
                u.last_name = req.body.last_name;
                u.phone = req.body.phone;
                u.group = req.body.group;
                winston.info('logged in as: ' + u);
                let token = u.generateJwt();
                return res.status(200).send({
                    "token": token
                });
            }
        });
       
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

router.get('/events/:id', function (req, res, next) {
    db.serialize(function () {
        db.get(db_queries[5], req.params.id, function (err, row) {
            if (err || row == null) {
                winston.error(err);
                return res.status(404).send({ message: 'event not found' });
            }
                
            return res.status(200).send(row);
        });
    });
});

router.post('/events/:id', auth, function (req, res, next) {
    db.serialize(function () {
        var stmt = db.prepare(db_queries[6]);
        for (let i = 0; i < req.body.class_1; i++) {
            stmt.run(req.params.id, req.user.id, 1);
        }
        for (let i = 0; i < req.body.class_2; i++) {
            stmt.run(req.params.id, req.user.id, 2);
        }
        for (let i = 0; i < req.body.class_3; i++) {
            stmt.run(req.params.id, req.user.id, 3);
        }
        stmt.finalize(function (err) {
            if (err) return res.status(500).send({ message: 'transaction failed' });
            return res.status(200).send({ message: 'transaction succeeded' });
        });
    });
});

router.get('/ticket-offices', function (req, res, next) {
    db.serialize(function () {
        db.all(db_queries[7], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.get('/organisers', function (req, res, next) {
    db.serialize(function () {
        db.all(db_queries[8], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.get('/venues', function (req, res, next) {
    db.serialize(function () {
        db.all(db_queries[9], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.get('/artists', function (req, res, next) {
    db.serialize(function () {
        db.all(db_queries[10], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.get('/clients', function (req, res, next) {
    db.serialize(function () {
        db.all(db_queries[11], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.get('/profile/events/', auth, function (req, res, next) {
    db.serialize(function () {
        winston.info(req.user.id);
        db.all(db_queries[12], req.user.id, function (err, rows) {
            if (err)
                winston.error(err);
            winston.info('Rows!' + rows);
            winston.info(rows);
            res.status(200).json(rows);
        });
    });
});

module.exports = router;