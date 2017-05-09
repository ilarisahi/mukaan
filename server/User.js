'use strict';
var jwt = require('jsonwebtoken');

class User {
    constructor(id, username, first_name, last_name, phone, group) {
        this.id = id;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone = phone;
        this.group = group;
    }

    generateJwt() {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        return jwt.sign({
            id: this.id,
            username: this.username,
            first_name: '' + this.first_name,
            last_name: '' + this.last_name,
            phone: '' + this.phone,
            group: '' + this.group,
            exp: parseInt(expiry.getTime() / 1000)
        }, 'secRET');
    }

    toString() {
        return 'id=' + this.id + 'username=' + this.username + ', first_name=' + this.first_name + ', last_name=' + this.last_name + ', ' + 'phone=' + this.phone + ', ' + 'group=' + this.group; 
    };
};

module.exports = User;