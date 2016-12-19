'use strict'

const { Email, Campaign } = require('../models')
const { m, r } = require('../models/thinky')
const email = require('../settings/email/email')

exports.failure = function *() {
  console.log('STARTING EMAIL FAIL ------------')
  console.log(this.request.body)
  console.log('ENDING EMAIL FAIL ------------')
  this.body = this.request.body
}

exports.find = function *() {
  let pending = yield m.table('emails').getAll('PENDING', { index: 'status'}).count()
  let failed = yield m.table('emails').getAll('FAILED', { index: 'status'})
  this.body = { pending, failed }
}

exports.send = function *() {
  let amount = this.params.amount || 14
  // get emails
  let emails = yield Email.getAll('PENDING', { index: 'status'}).getJoin({ user: true, campaign: true, competition: true }).limit(amount)

  for (var i = 0; i < emails.length; i++) {
    // process email (create new email fn that actually throws error)
    let { user, campaign, competition } = emails[i]
    let data = { user, campaign, competition, html: campaign.body, to: user.username, subject: campaign.subject }
    try {
      let aws = yield email.sendHtmlWithError(data)
      yield Email.get(emails[i].id).update({ status: 'SENT', aws })
    } catch(e) {
      console.log(e)
      yield Email.get(emails[i].id).update({ status: 'FAILED', aws:JSON.parse(e) })
    }
  }

  this.body = { emails, amount }
}
