const bcrypt = require ('bcrypt')
const salt = '$2b$10$JMaxpcJIGx9MKxjZYdvIL.'//generate salt -> bcrypt.genSaltSync(10)    

function cryptPass(pass) {
  return bcrypt.hashSync(pass, salt)
}

function comparePass(passInput, passCrypt) {
  return bcrypt.hashSync(passInput, salt) === passCrypt
}

module.exports = { cryptPass, comparePass }