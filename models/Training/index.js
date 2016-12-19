'use strict'

const { type, r, thinky } = require('../thinky')
const validator = require('validator')
const _ = require('lodash')

let User = thinky.createModel("trainings", {
    id: type.string(),
    type: type.string().enum(['video', 'slideshow']).required(),
    url: type.string().required(),
    createdAt: type.date().default(function() { return new Date() })
});

_.each(require('./static'), (obj, key) => User.defineStatic(key, obj))
_.each(require('./methods'), (obj, key) => User.define(key, obj))

module.exports = User;

// User.hasAndBelongsToMany(require('../Client'), "clients", "id", "id");
