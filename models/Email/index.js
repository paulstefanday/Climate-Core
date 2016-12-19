'use strict'

const { type, r, thinky } = require('../thinky')
const validator = require('validator')
const _ = require('lodash')

let Email = thinky.createModel("emails", {
  id: type.string(),
  status: type.string().default('PENDING'), // 'SENT' 'FAILED' 'RETRY'
  aws: type.object().default({}),
  opened: type.boolean().default(false),
  createdAt: type.date().default(function() { return new Date() })
});

_.each(require('./static'), (obj, key) => Email.defineStatic(key, obj))
_.each(require('./methods'), (obj, key) => Email.define(key, obj))

Email.ensureIndex("createdAt")
Email.ensureIndex("status")
Email.ensureIndex("userId")
Email.ensureIndex("competitionId")
Email.ensureIndex("campaignId")

module.exports = Email;

Email.belongsTo(require('../User'), "user", "userId", "id");
Email.belongsTo(require('../Competition'), "competition", "competitionId", "id");
Email.belongsTo(require('../Campaign'), "campaign", "campaignId", "id");
