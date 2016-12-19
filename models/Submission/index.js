'use strict'

const { type, r, thinky } = require('../thinky')
const validator = require('validator')
const _ = require('lodash')

let Submission = thinky.createModel("submissions", {
    id: type.string(),
    type: type.string().default('LINK'), // type: [‘LINK’, ‘VIDEO’, ‘PARAGRAPH’, 'SENTENCE', 'BOOLEAN']
    state: type.string().default('SUBMITTED'),// state [SUBMITTED, CONTACTED, REJECTED, SENT]
    // adopted: type.object().default({}),
    reviews: type.array().default([]),
    createdAt: type.date().default(function() { return new Date() })


    // url: type.string(), //.required(),// url
    // title: type.string(), //.required(), // title
    // publisher: type.string(), //.required(),// publisher
    // country: type.string(), //.required(),
    // language: type.string(), //.required(),
    // member: type.string(),// member [yes, no, no but i’d like to be]
    // topic: type.string(), //.required(), // REMOVE THIS FIELD NOT USED ANYMORE replaced by tag field
    // summary: type.string(), //.required(),
    // time: type.string(), // 1-2, 2-3, 3-4 hours
    // publishDifficulty: type.string(), // publishDifficulty [EASY, MEDIUM, HARD]
    // publishPrevious: type.number(),
    // fellowship: type.string(), // YES/NO fellowship ??? does this need its own record because there will be new fellowships all the time, which one does this relate to?
    // challenges: type.string(),
    // tag: type.string(), //

});

Submission.ensureIndex("createdAt")
Submission.ensureIndex("state")
Submission.ensureIndex("userId")
Submission.ensureIndex("competitionId")
Submission.ensureIndex("partId")

_.each(require('./static'), (obj, key) => Submission.defineStatic(key, obj))
_.each(require('./methods'), (obj, key) => Submission.define(key, obj))

module.exports = Submission;

Submission.belongsTo(require('../Part'), "part", "partId", "id");
Submission.belongsTo(require('../User'), "user", "userId", "id");
Submission.belongsTo(require('../User'), "adopted", "adoptedId", "id");
Submission.belongsTo(require('../Competition'), "competition", "competitionId", "id");
Submission.hasMany(require('../Review'), "reviews", "id", "submissionId");
