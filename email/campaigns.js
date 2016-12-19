'use strict'

const { Campaign, User, Email } = require('../models')
const { m, r } = require('../models/thinky')

exports.create = function *() {
  let { body, start, subject, from, ids } = this.request.body
  if( !body || !start || !subject || !from || !ids ) this.throw(400, 'Please enter all required fields')

  delete this.request.body.id
  this.request.body.start = new Date(this.request.body.start)
  this.request.body.userId = this.user.id

  let campaign = new Campaign(this.request.body)
  this.body = yield campaign.save()
}

exports.publish = function *() {
  this.body = yield Campaign.get(this.params.id).update({ published: true })
}

exports.ready = function *() {
  this.body = yield Campaign.filter(
    r.row('sent').eq(false)
      .and(r.row('published').eq(true))
      .and(r.row('start').le(new Date()))
  )
}

exports.generate = function *() {
  // Find campaigns that are published
  let campaigns = yield Campaign.filter(
    r.row('sent').eq(false)
      .and(r.row('published').eq(true))
      .and(r.row('start').le(new Date()))
  )

  for (let a = 0; a < campaigns.length; a++) {
    let campaign = campaigns[a]
    if(campaign.competitionId === 'ALL') campaign.ids = yield m.table('users').getField('id')
    yield m.table('campaigns').get(campaign.id).update({ sent: true })
    for (let i = 0; i < campaign.ids.length; i++) {
      let email = new Email({
        userId: campaign.ids[i],
        competitionId: campaign.competitionId,
        campaignId: campaign.id
      })
      yield email.save()
    }
  }

  // Update campaign record
  this.body = { processed: true, campaigns }
}

exports.update = function *() {
  delete this.request.body.id
  this.request.body.start = new Date(this.request.body.start)
  this.body = yield Campaign.get(this.params.id).update(this.request.body)
}

exports.delete = function *() {
  this.body = yield m.table('campaigns').get(this.params.id).delete()
}
