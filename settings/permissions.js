'use strict'

const Roles = require('koa-roles')

// Error handling
let user = new Roles({ failureHandler: function* (action) {
    this.throw(403, 'Access Denied - You are not ' + action + '.')
}})

// Roles
user.use('logged in', function (action) {
	if (this.user) return true;
})

user.use('admin', function (action) {
	if (this.user.permission === 'ADMIN') return true;
})

module.exports = user
