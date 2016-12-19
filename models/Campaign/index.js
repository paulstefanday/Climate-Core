'use strict'

const { type, r, thinky } = require('../thinky')
const validator = require('validator')
const _ = require('lodash')

let Campaign = thinky.createModel("campaigns", {
  id: type.string(),
  // title: type.string().required(),
  body: type.string().required(),
  start: type.date().required(),
  subject: type.string().required(),
  from: type.string().email().required(),
  ids: type.array().default([]),
  type: type.string().default('empty'), // other names of template jade files
  published: type.boolean().default(false),
  sent: type.boolean().default(false),
  createdAt: type.date().default(function() { return new Date() })
});

_.each(require('./static'), (obj, key) => Campaign.defineStatic(key, obj))
_.each(require('./methods'), (obj, key) => Campaign.define(key, obj))

Campaign.ensureIndex("createdAt")
Campaign.ensureIndex("type")
Campaign.ensureIndex("userId")
Campaign.ensureIndex("competitionId")

module.exports = Campaign;

Campaign.belongsTo(require('../Competition'), "competition", "competitionId", "id");
Campaign.belongsTo(require('../User'), "user", "userId", "id");
Campaign.hasMany(require('../Email'), "emails", "id", "campaignId");
