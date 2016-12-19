'use strict'

const { type, r, thinky } = require('../thinky')
const validator = require('validator')
const _ = require('lodash')

let User = thinky.createModel("users", {
    id: type.string(),
    firstName: type.string().required(),
    lastName: type.string(),
    country: type.string(),
    username: type.string().email().required(),
    password: type.string().required(),
    permission: type.string().default(function() { return 'USER' }),
    createdAt: type.date().default(function() { return new Date() })
});

_.each(require('./static'), (obj, key) => User.defineStatic(key, obj))
_.each(require('./methods'), (obj, key) => User.define(key, obj))

User.ensureIndex("username")
User.ensureIndex("createdAt")

module.exports = User;

User.hasAndBelongsToMany(require('../Competition'), "competitions", "id", "id");
User.hasMany(require('../Submission'), "submissions", "id", "userId");
User.hasMany(require('../Review'), "reviews", "id", "userId");
User.hasMany(require('../Submission'), "adoptions", "id", "adoptedId");
