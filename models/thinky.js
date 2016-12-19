'use strict'

let options = {
	db: process.env.DB,
	port: process.env.DBPORT,
	host: process.env.DBHOST
}

if(process.env.DBAUTH) options.authKey = process.env.DBAUTH

const thinky = require('thinky')(options);

module.exports = {
  thinky,
  r: thinky.r,
  type: thinky.type,
  m: thinky.r.db(process.env.DB)
}
