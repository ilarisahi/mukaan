'use strict';
const express = require('express');
const router = express.Router();
var winston = require('winston');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var selectQueries = require('../db').selectQueries;
var insertQueries = require('../db').insertQueries;
var updateQueries = require('../db').updateQueries;
var deleteQueries = require('../db').deleteQueries;
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
        db.run(insertQueries[1], req.body.first_name, req.body.last_name, req.body.phone, function(err) {
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
                    db.get(selectQueries[1], user.id, function(err, row) {
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
                db.get(selectQueries[1], req.user.id, function (err, row) {
                    if (err || row == null || row == '') return res.status(401).send({ message: 'user doesn\'t exist' });
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
                        db.run(updateQueries[1], req.body.first_name, req.body.last_name, req.body.phone, req.user.id, function (err) {
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

router.get('/organisers', auth, function (req, res, next) {
    db.serialize(function () {
        db.all(selectQueries[4], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.post('/organisers', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (req.body.name == null || req.body.www == null) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(insertQueries[2], req.body.name, req.body.www, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.put('/organisers', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.body.o_id) || req.body.name == null || req.body.www == null) return res.status(500).send({ message: 'invalid body' });
    console.log(req.body);
    db.serialize(function () {
        db.run(updateQueries[2], req.body.name, req.body.www, req.body.o_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.delete('/organisers/:o_id', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.params.o_id)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(deleteQueries[2], req.params.o_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});


router.get('/venues', function (req, res, next) {
    db.serialize(function () {
        db.all(selectQueries[5], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.post('/venues', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (req.body.name == null || req.body.address == null || isNaN(req.body.capacity_1) || isNaN(req.body.capacity_2) || isNaN(req.body.capacity_3)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(insertQueries[3], req.body.name, req.body.address, req.body.capacity_1, req.body.capacity_2, req.body.capacity_3, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.put('/venues', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.body.v_id) || req.body.name == null || req.body.address == null || isNaN(req.body.capacity_1) || isNaN(req.body.capacity_2) || isNaN(req.body.capacity_3)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(updateQueries[3], req.body.name, req.body.address, req.body.capacity_1, req.body.capacity_2, req.body.capacity_3, req.body.v_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.delete('/venues/:v_id', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.params.v_id)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(deleteQueries[3], req.params.v_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});


router.get('/artists', function (req, res, next) {
    db.serialize(function () {
        db.all(selectQueries[6], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.post('/artists', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (req.body.name == null || req.body.category == null || req.body.phone == null) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(insertQueries[0], req.body.name, req.body.category, req.body.phone, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.put('/artists', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.body.a_id) || req.body.name == null || req.body.category == null || req.body.phone == null) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(updateQueries[0], req.body.name, req.body.category, req.body.phone, req.body.a_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.delete('/artists/:a_id', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.params.a_id)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(deleteQueries[0], req.params.a_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.get('/clients', auth, function (req, res, next) {
    db.serialize(function () {
        db.all(selectQueries[7], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.post('/clients', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (req.body.first_name == null || req.body.last_name == null || req.body.phone == null) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(insertQueries[1], req.body.first_name, req.body.last_name, req.body.phone, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.put('/clients', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.body.c_id) || req.body.first_name == null || req.body.last_name == null || req.body.phone == null) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(updateQueries[1], req.body.first_name, req.body.last_name, req.body.phone, req.body.c_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.delete('/clients/:c_id', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.params.c_id)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(deleteQueries[1], req.params.c_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.get('/events', function (req, res, next) {
    db.serialize(function () {
        db.all(selectQueries[0], function (err, rows) {
            if (err)
                winston.error(err);
            res.send(rows);
        });
    });
});

router.post('/events', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    winston.info(req.body);
    var starts = Date.parse(req.body.starts);
    var ends = Date.parse(req.body.ends);
    if (isNaN(req.body.e_id) || isNaN(req.body.v_id) || isNaN(req.body.fee) || isNaN(starts) || isNaN(ends)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(insertQueries[7], req.body.e_id, req.body.v_id, req.body.fee, req.body.starts, req.body.ends, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.put('/events', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    let starts = Date.parse(req.body.starts);
    let ends = Date.parse(req.body.ends);
    if (isNaN(req.body.ei_id) || isNaN(req.body.e_id) || isNaN(req.body.v_id) || isNaN(req.body.fee) || isNaN(starts) || isNaN(ends)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(updateQueries[7], req.body.v_id, req.body.fee, req.body.starts, req.body.ends, req.body.ei_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.delete('/events/:ei_id', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.params.ei_id)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(deleteQueries[7], req.params.ei_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.get('/events/:id', function (req, res, next) {
    db.serialize(function () {
        db.get(selectQueries[2], req.params.id, function (err, row) {
            if (err || row == null) {
                winston.error(err);
                return res.status(404).send({ message: 'event not found' });
            }

            return res.status(200).send(row);
        });
    });
});

router.get('/events-admin', function (req, res, next) {
    db.serialize(function () {
        db.all(selectQueries[10], function (err, rows) {
            if (err)
                winston.error(err);
            res.send(rows);
        });
    });
});

router.get('/events-main', function (req, res, next) {
    db.serialize(function () {
        db.all(selectQueries[9], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.post('/events-main', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.body.o_id) || req.body.name == null || req.body.description == null || isNaN(req.body.cost)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(insertQueries[5], req.body.o_id, req.body.name, req.body.description, req.body.cost, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            let e_id = this.lastID;
            var stmt = db.prepare(insertQueries[6]);
            for (let i = 0; i < req.body.artists.length; i++) {
                stmt.run(e_id, req.body.artists[i]);
            }
            stmt.finalize(function (err) {
                if (err) return res.status(500).send({ message: 'transaction failed' });
                return res.status(200).send({ message: 'transaction succeeded' });
            });
        });
    });
});

router.put('/events-main', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.body.e_id) || isNaN(req.body.o_id) || req.body.name == null || req.body.description == null || isNaN(req.body.cost)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(updateQueries[5], req.body.o_id, req.body.name, req.body.description, req.body.cost, req.body.e_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            var diff1 = [];
            var diff2 = [];
            winston.info(req.body.artists + ' : ' + req.body.og_artists);
            if (req.body.og_artists == null) {
                diff2 = req.body.artists ? req.body.artists : [];
            }

            if (req.body.artists == null) {
                diff1 = req.body.og_artists ? req.body.og_artists : [];
            }

            if (req.body.artists != null && req.body.og_artists != null) {
                diff1 = req.body.og_artists.filter(x => req.body.artists.indexOf(x) < 0);
                diff2 = req.body.artists.filter(x => req.body.og_artists.indexOf(x) < 0);
            }
            
            var stmt1 = db.prepare(deleteQueries[6]);
            for (let i = 0; i < diff1.length; i++) {
                stmt1.run(req.body.e_id, diff1[i]);
            }
            var stmt2 = db.prepare(insertQueries[6]);
            for (let i = 0; i < diff2.length; i++) {
                stmt2.run(req.body.e_id, diff2[i]);
            }
            stmt1.finalize(function (err) {
                if (err) return res.status(500).send({ message: 'transaction failed' });
                stmt2.finalize(function (err) {
                    if (err) return res.status(500).send({ message: 'transaction failed' });
                    return res.status(200).send({ message: 'transaction succeeded' });
                });
            });

        });
    });
});

router.delete('/events-main/:e_id', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.params.e_id)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(deleteQueries[5], req.params.e_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        })
    })
});

router.get('/tickets', auth, function (req, res, next) {
    if (req.user.group !== 'admin') return res.status(403).send({ message: 'access denied' });

    db.serialize(function () {
        db.all(selectQueries[11], function (err, rows) {
            if (err || rows == null) {
                winston.error(err);
                return res.status(404).send({ message: 'tickets not found' });
            }

            return res.status(200).send(rows);
        });
    });
});

router.post('/tickets', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.body.ei_id) || isNaN(req.body.c_id) || isNaN(req.body.ticket_class)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(insertQueries[8], req.body.ei_id, req.body.c_id, req.body.ticket_class, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.put('/tickets', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.body.eic_id) || isNaN(req.body.ticket_class)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(updateQueries[8], req.body.ticket_class, req.body.eic_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.delete('/tickets/:eic_id', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.params.eic_id)) return res.status(500).send({ message: 'invalid body' });
    winston.info('deleting ticket...');
    winston.info(req.params.eic_id);
    db.serialize(function () {
        db.run(deleteQueries[8], req.params.eic_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.post('/events/:id', auth, function (req, res, next) {
    db.serialize(function () {
        var stmt = db.prepare(insertQueries[8]);
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
        db.all(selectQueries[3], function (err, rows) {
            if (err)
                winston.error(err);
            res.status(200).send(rows);
        });
    });
});

router.post('/ticket-offices', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.body.o_id) || req.body.address == null || req.body.hours == null) return res.status(500).send({ message: 'invalid body' });
    console.log(req.body);
    db.serialize(function () {
        db.run(insertQueries[4], req.body.o_id, req.body.address, req.body.hours, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.put('/ticket-offices', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.body.to_id) ||isNaN(req.body.o_id) || req.body.address == null || req.body.hours == null) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(updateQueries[4], req.body.o_id, req.body.address, req.body.hours, req.body.to_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.delete('/ticket-offices/:to_id', auth, function (req, res, next) {
    if (req.user.group != 'admin') return res.status(403).send({ message: 'not authorized' });
    if (isNaN(req.params.to_id)) return res.status(500).send({ message: 'invalid body' });
    db.serialize(function () {
        db.run(deleteQueries[4], req.params.to_id, function (err) {
            if (err) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send({ message: 'success' });
        });
    });
});

router.get('/profile/events/', auth, function (req, res, next) {
    db.serialize(function () {
        winston.info(req.user.id);
        db.all(selectQueries[8], req.user.id, function (err, rows) {
            if (err)
                winston.error(err);
            winston.info('Rows!' + rows);
            winston.info(rows);
            res.status(200).json(rows);
        });
    });
});

router.get('/stats', function (req, res, next) {
    //if (req.user.group != 'admin' || req.user.group != 'employee') return res.status(403).send({ message: 'not authorized' });
    db.serialize(function () {
        db.all(selectQueries[12], function (err, rows) {
            if (err || rows == null) {
                winston.error(err);
                return res.status(500).send({ message: err });
            }
            return res.status(200).send(rows);
        });
    });
});

module.exports = router;