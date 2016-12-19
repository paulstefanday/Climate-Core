'use strict'

const { User } = require('../models')
const Email = require('./email')


exports.create = function *() {

  // Create user
  let record = yield User.userCreate(this.request.body);

  // Set session
  let session = yield this.session;
  session.user = record.id

  // Send welcome email
  yield Email.signup({ user: record })

  this.body = { success: true }

}


exports.login = function *() {

  let { password, username } = this.request.body;

  // Make sure password is entered
  if(!password || !username) this.throw(400, 'You must fill out all fields to signup');

  // Check if user exists
  let record = yield User.mustExist(username);

  // Check password is correct
  yield record.comparePassword(password)

  // Set cookie session
  let session = yield this.session;
  session.user = record.id

  this.body = { success: true }
}


exports.logout = function *() {

  // Remove cookie session
  this.session = false
  this.body = { success: true }

}



exports.reset = function *() {

  let { newPassword, email } = this.request.body;

  // Check if email was passed as param
  if(!email || !newPassword) this.throw(400, 'Please enter all required fields');

  // check for existing user
  let user = yield User.mustExist(email);

  // Create token
  let resetToken = new Date()
  resetToken = resetToken.getTime() + '--' + user.id

  // Update
  user = yield User.get(user.id).update({ newPassword, resetToken })

  // Send email
  yield Email.reset({ user })

  this.body = { message: 'Password reset email has been sent' };
  this.status = 200;

}


exports.confirm = function *() {
  // find user
  let resetToken = this.params.resetToken
  let users = yield User.filter({ resetToken })
  if(users.length === 0) this.throw(400, 'Token is not valid')

  // update password
  let user = users[0]
  let password = yield User.hashPassword(user.newPassword)
  yield User.get(user.id).update({ password, newPassword: '', resetToken: '' })

  // redirect to login page
  this.redirect('/login')

}
