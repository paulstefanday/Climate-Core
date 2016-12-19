'use strict'

const Models = require('../')
const bcrypt = require('co-bcryptjs')
const { r, thinky } = require('../thinky')

module.exports = {

	comparePassword: function *(password) {

		let compare = yield bcrypt.compare(password, this.password)

		if(!compare) throw new Error('You have used an invalid password')

	}

}
