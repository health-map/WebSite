const jwt = require('jsonwebtoken')
const { secret } = require('./config')

function sign(payload, cb) {
  jwt.sign(payload, secret, {}, cb)
}

function verify(token, cb) {
  jwt.verify(token, secret, cb)
}

module.exports = {
  token: {
    sign,
    verify
  }
}
