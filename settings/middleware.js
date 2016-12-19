'use strict'

const Models = require('../models')
const thinky = require('../models/thinky')
const genericSession = require('koa-generic-session')
const RethinkSession = require('koa-generic-session-rethinkdb')
const sessionStore = new RethinkSession({ connection: thinky.r, db: process.env.DB, table: 'sessions' })
const compress = require('koa-compress')

exports.auth = function *(next) {
  var session = yield this.session;
  if(session.user) {
    let user = yield Models.User.get(session.user)
    if(user) this.user = user
  }

  yield next;
}

exports.compress = compress({
  filter: function (content_type) {
    return /[text|application]/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
})

exports.errors = function * (next) {
  try {
    yield next
  } catch (err) {
    this.body = { message: err.message }
    this.status = err.status || 500
    this.app.emit('error', err, this)
  }
}

exports.cors = function * (next) {
  this.set('Access-Control-Allow-Origin', this.request.headers.origin)
  this.set('Access-Control-Allow-Credentials', true)
  this.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  this.set('Access-Control-Allow-Headers', 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization')

  if (this.request.method === 'OPTIONS') {
    this.status = 200
    return
  } else {
    yield next
  }
}

exports.session = genericSession({
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 * 4 },
  secret: process.env.SECRET,
  key: 'climatetracker',
  store: sessionStore,
  defer: true
})

exports.permissions = require(`${__base}/api/settings/permissions`).middleware()

exports.bodyparser = require('koa-bodyparser')()

exports.logger = require('koa-logger')()

exports.render = require('koa-render')(`${__base}/`, 'jade', { jade: 'jade' })
