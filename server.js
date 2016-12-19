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

const app = module.exports = require('koa')()
const middleware = require('./settings/middleware')

// auth rotues
const auth = require('./settings/auth')
const api = new Router()
api
  .post('/login', auth.login)
  .post('/signup', auth.create)
  .get('/logout', auth.logout)


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
