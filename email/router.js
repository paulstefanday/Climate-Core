'use strict'

// Router Vars
const Router = require('koa-router')
const api = new Router()
const user = require(`${__base}api/settings/permissions`)
const { campaigns, emails, filters } = require(`./`)

// Permissions
const validUser = user.is('logged in')
const validAdmin = [ validUser, user.is('admin') ]

api

  // Campaigns
  .get('/', function *() { this.body = { message: "Welcome to the Email API"} })
  .post('/campaigns', ...validAdmin, campaigns.create)
  // .get('/campaigns/:id', ...validAdmin, campaigns.send)
  .put('/campaigns/:id', ...validAdmin, campaigns.update)
  .put('/campaigns/:id/publish', ...validAdmin, campaigns.publish)
  .get('/campaigns/:id/ready', ...validAdmin, campaigns.ready)

  .delete('/campaigns/:id', ...validAdmin, campaigns.delete)

  // emails
  .get('/emails', ...validAdmin, emails.find)

  // CRON
  .get('/cron/campaigns', campaigns.generate)
  .get('/cron/emails', emails.send)
  .post('/failure', emails.failure)
  // Filters
  .get('/filter/basic/:id', ...validAdmin, filters.basic)

module.exports = api.middleware()
