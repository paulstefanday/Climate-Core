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
const serve = require('koa-static')
const route = require('koa-route')
const mount = require('koa-mount')
const middleware = require('./api/settings/middleware')
const appRoute = require('./client/app/render')
const appv2Route = require('./client/appv2/render')
const emailRoute = require('./client/email/render')

// Basic Middleware
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

  // Static Routes
  .use(mount('/static/images/', serve('client/shared/images/'))) // Static files
  .use(mount('/images/', serve('client/shared/images/'))) // Static files

  // Email Routes
  .use(mount('/static/email/', serve('client/email/dist/'))) // Static files
  .use(mount('/api/email', require('./api/email/router'))) // API routes
  .use(route.get('/email/*', emailRoute))

  // Appv2 Routes
  .use(mount('/static/appv2/', serve('client/appv2/'))) // Static files
  .use(mount('/api/v2', require('./api/appv2/router'))) // API routes
  .use(route.get('/v2/*', appv2Route)) // Catch all other routes for client app

  // App Routes
  .use(mount('/static/app/', serve('client/app/dist/'))) // Static files
  .use(mount('/api/app', require('./api/app/router'))) // API routes
  .use(route.get('/*', appRoute)) // Catch all other routes for client app

  // Start app server
  .listen(process.env.PORT, () => console.log('API on port ' + process.env.PORT))
