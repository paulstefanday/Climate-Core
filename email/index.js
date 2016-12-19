'use strict'

const fs = require('fs')
const path = require('path')

fs
.readdirSync(__dirname)
.filter(file => file.indexOf('index.') === -1 || file.indexOf('router.') === -1)
.forEach(function (file) {
  let name = file.split('.')[0]
  module.exports[name] = require(`./${file}`);
})
