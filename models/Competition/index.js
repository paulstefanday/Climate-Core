'use strict'

const { type, r, thinky } = require('../thinky')
const validator = require('validator')
const _ = require('lodash')

let Competition = thinky.createModel("competitions", {
    id: type.string(),
    title: type.string().required(),
    description: type.string().required(),
    prize: type.string().required(),
    share: type.string(),
    warning: type.string(),
    createdAt: type.date().default(function() { return new Date() }),
    start: type.date().required(),
    finish: type.date().required(),
    videos: type.array().default([]),
    hidden: type.boolean().default(false),
    resultMessage: type.string(),
    campaigns: type.array().default([]),
    parts: type.array().default([])
});

_.each(require('./static'), (obj, key) => Competition.defineStatic(key, obj))
_.each(require('./methods'), (obj, key) => Competition.define(key, obj))

Competition.ensureIndex("createdAt")
Competition.ensureIndex("title")
Competition.ensureIndex("finish")
Competition.ensureIndex("start")
Competition.ensureIndex("prize")
Competition.ensureIndex("closed")

module.exports = Competition;

Competition.hasAndBelongsToMany(require('../User'), "users", "id", "id");
Competition.hasMany(require('../Review'), "reviews", "id", "competitionId");
Competition.hasMany(require('../Part'), "parts", "id", "competitionId");
Competition.hasMany(require('../Submission'), "submissions", "id", "competitionId");
Competition.hasMany(require('../Campaign'), "campaigns", "id", "competitionId");
