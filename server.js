'use strict'

// Load env vars if local
if(process.env.NODE_ENV === 'development') require('dotenv').load()
// Set global base for easy file loading
global.__base = __dirname + '/'

// For server side rendering all window and document global
const jsdom = require('jsdom')
jsdom.env({
  html: "<html><body></body></html>",
  done: (errs, window) => {
    global.window = window
    global.document = global.window.document;
  }
})

const app = require('koa')()
const middleware = require('./settings/middleware')
const models = require('./models')
const thinky = require('./models/thinky')
const user = require(`./settings/permissions`)

// auth
const auth = require('./settings/auth')
const Router = require('koa-router')
const api = new Router()
api
  .post('/login', auth.login)
  .post('/signup', auth.create)
  .get('/logout', auth.logout)

// app
app.keys = [process.env.SECRET]
app
  .use(middleware.logger)
  .use(middleware.cors)
  .use(middleware.bodyparser)
  .use(middleware.errors)
  .use(middleware.permissions)
  .use(middleware.session)
  .use(middleware.auth)
  .use(middleware.render)
  .use(middleware.compress)
  .use(api.middleware())

 module.exports = {
   app, thinky, models, user
 }
