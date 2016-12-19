var email = require('./email')

exports.review = function* (body) {
  var data = {
    to: body.user.username,
    subject: 'Your Climate Tracker article has been reviewed!',
    template: 'review',
    body
  }

  return yield email.send(data)
}

exports.reject = function* (body) {
  var data = {
    to: body.user.username,
    subject: 'Your Climate Tracker article has been rejected',
    template: 'reject',
    body
  }

  return yield email.send(data)
}

exports.join = function* (body) {
  var data = {
    to: body.user.username,
    subject: 'You have joined a competition!',
    template: 'join',
    body
  }

  return yield email.send(data)
}

exports.signup = function* (body) {
  var data = {
    to: body.user.username,
    subject: 'Welcome to Climate Tracker',
    template: 'signup',
    body
  }

  return yield email.send(data)
}

exports.reset = function* (body) {
  var data = {
    to: body.user.username,
    subject: 'You have requested a password reset',
    template: 'reset',
    body
  }

  return yield email.send(data)
}

// Use in controllers example:
// var testemail = yield Email.test()
