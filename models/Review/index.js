'use strict'

const { type, r, thinky } = require('../thinky')
const validator = require('validator')
const _ = require('lodash')

let Review = thinky.createModel("reviews", {
  id: type.string(),
  comment: type.string(),
  style: type.number().required(),
  content: type.number().required(),
  originality: type.number().required(),
  reach: type.number().required(),
  engagement: type.number().required(),
  total: type.number().required(),
  max: type.number().default(5),
  percentage: type.number(),
  createdAt: type.date().default(function() { return new Date() })
});

_.each(require('./static'), (obj, key) => Review.defineStatic(key, obj))
_.each(require('./methods'), (obj, key) => Review.define(key, obj))

module.exports = Review;

Review.belongsTo(require('../Competition'), "competition", "competitionId", "id");
Review.belongsTo(require('../User'), "user", "userId", "id");
Review.belongsTo(require('../Submission'), "submission", "submissionId", "id");
