import configConnection from '../../../connections/config-pg'
import Profile from '../profile/profile'
const { Client } = require('pg')
const crypt = require('../../../methods/crypt.js')
const connection = require('../../../database/connection')

function Users() {
  this.user_id = 0
  this.username = ''
  this.password = ''
  this.email = ''
  this.created_on = 0
  this.last_login = 0
  this.profile_id = 0

  this.load = async (user_id = this.user_id) => {

    try {
      const user = await connection('accounts')
        .select([
          'user_id',
          'username',
          'password',
          'email',
          'created_on',
          'last_login'
        ])
        .where({ user_id })

      this.user_id = user.user_id
      this.username = user.username
      this.password = user.password
      this.email = user.email
      this.created_on = user.created_on
      this.last_login = user.last_login

      return Promise.resolve()
    } catch (e) {
      return Promise.reject({ msg: 'Falha interna ao selecionar usuarios!' })
    }
  }

  this.validateUserExists = async (username) => {
    try {
      let [{ count }] = await connection('accounts')
        .count()
        .whereRaw('upper(username) = upper(?)', username)

      return (
        count == 0 ? Promise.resolve() : Promise.reject({ msg: 'Usuário já existente, tente outro username!' })
      )

    } catch (e) {
      console.log(e)
      return Promise.reject({ msg: 'Falha ao validar usuario!' })
    }
  }

  this.validate = () => {
    return new Promise((resolve, reject) => {
      if (!this.username.trim) {
        reject({ msg: err.msg === undefined ? 'O username é obrigatório!' : err.msg })
      } else {
        this.validateUserExists(this.username)
          .then(() => resolve())
          .catch(err => { reject({ msg: err.msg === undefined ? 'Usuario já existente' : err.msg }) })
      }
    })
  }

  this.register = async () => {
    try {
      const profile = new Profile()
      profile.name = this.username
      const profile_id = await profile.register()
      const passCrypted = crypt.cryptPass(this.password)

      await connection('accounts')
        .insert({
          username: this.username,
          password: passCrypted,
          email: this.email,
          profile_id: profile_id
        })

      return Promise.resolve()
    } catch (e) {
      return Promise.reject({ msg: 'Falha interna!' })
    }
  }
}

export default Users
