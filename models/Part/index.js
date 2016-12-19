'use strict'

const { type, r, thinky } = require('../thinky')
const validator = require('validator')
const _ = require('lodash')

let Part = thinky.createModel("parts", {
  id: type.string(),
  title: type.string().required(),
  form: type.string().default('DEFAULT'),// CUSTOM
  custom: type.string(),
  tags: type.array().default([]),
  description: type.string().required(),
  videos: type.array().default([]),
  order: type.number(),
  submissions: type.array().default([]),
  completed: type.boolean().default(false),
  active: type.boolean().default(false),
  createdAt: type.date().default(function() { return new Date() })
});

_.each(require('./static'), (obj, key) => Part.defineStatic(key, obj))
_.each(require('./methods'), (obj, key) => Part.define(key, obj))

Part.ensureIndex("createdAt")
Part.ensureIndex("order")

module.exports = Part;

Part.belongsTo(require('../Competition'), "competitions", "competitionId", "id");
Part.hasMany(require('../Submission'), "submissions", "id", "partId");
