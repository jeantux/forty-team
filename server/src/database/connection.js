const knex = require('knex')
const configuration = require('../../knexfile')

module.exports = knex(configuration.development)