'use strict'

const Models = require('../')
const bcrypt = require('co-bcryptjs')
const randomstring = require('randomstring')
const { type, r } = require('../thinky')

module.exports = {

	mustNotExist: function*(username) {

		// Find user by email
		let user = yield Models.User.filter({ username: username.toLowerCase() })

		// Check if response is an empty array and return id or false
		if(user.length > 0) throw new Error('You have already signed up');

		return user[0]
	},

	mustExist: function*(username) {

		// Find user by email
		let user = yield Models.User.filter({ username: username.toLowerCase() })

		// Check if response is an empty array and return id or false
		if(user.length < 1) throw new Error('Your account does not exist');

		return user[0]
	},


	userCreate: function*(data) {

		let { password, username, firstName, lastName, country, dob } = data;

		// Make sure password is entered
		if(!password || !username || !firstName || !country || !lastName || !dob ) throw new Error('You must fill out all fields to signup');

		// secific formatting for dob
		data.dob = new Date(dob)

		yield this.mustNotExist(username)

		// Set password if it's not set already
		// let raw = data.password || randomstring.generate(7)

		// Hash password
		data.password = yield this.hashPassword(password)

		// Create record
		let record = new Models.User(data)

		// Save record
		let saved = yield record.save()

		// Send an email to user with their password


		return saved;
	},


	hashPassword: function*(password) {

		// Generate Salt
		let salt = yield bcrypt.genSalt(10)

		// Hash password
		return yield bcrypt.hash(password, salt)
	}

}
