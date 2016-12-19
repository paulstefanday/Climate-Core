'use strict'
const _ = require('lodash')
const { User, Competition, Submission } = require('../models')
const { m, r } = require('../models/thinky')

exports.basic = function *() {
  let competition = yield Competition.get(this.params.id).getJoin({
    campaigns: true,
    parts: { submissions: { reviews: true } }
  })
  let joined = yield m.table('competitions_users').getAll(this.params.id, { index: 'competitions_id' }).getField('users_id')
  let activity = [{ title: 'Joined', ids: joined }]

  for (var i = 0; i < competition.parts.length; i++) {
    let submitted = competition.parts[i].submissions.map(sub => sub.userId)
    let notsubmitted = _.difference(joined, submitted)
    
    activity.push({ title: `Not Submitted ${i + 1}`, ids: notsubmitted })
    activity.push({ title: `Submitted ${i + 1}`, ids: submitted })
    activity.push({
      title: `Reviewed ${i + 1}`,
      ids: competition.parts[i].submissions.filter(sub => sub.reviews.length > 0).map(sub => sub.userId)
    })
    activity.push({
      title: `Scored 17+ on ${i + 1}`,
      ids: competition.parts[i].submissions.filter(sub => sub.reviews.length > 0 && sub.reviews[0].total > 16).map(sub => sub.userId)
    })

  }

  this.body = { activity, competition }
}
