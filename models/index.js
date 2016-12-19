'use strict'

const fs = require('fs')
const path = require('path')

fs
.readdirSync(__dirname)
.filter(file => file.indexOf('.') === -1)
.forEach(function (file) {
  module.exports[file] = require(`./${file}`);
})
