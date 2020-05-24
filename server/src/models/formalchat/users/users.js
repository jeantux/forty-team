import configConnection from '../../../connections/config-pg'
import Profile from '../profile/profile'
const { Client } = require('pg')
const crypt = require('../../../methods/crypt.js')

function Users() {
  this.user_id = 0
  this.username = ''
  this.password = ''
  this.email = ''
  this.created_on = 0
  this.last_login = 0
  this.profile_id = 0

  this.load = (user_id) => {
    let id = user_id ? user_id : this.user_id
    return new Promise(async (resolve, reject) => {

      const client = new Client(configConnection)
      await client.connect()

      let sqlQry = ` select a.user_id,
                            a.username,
                            a.password,
                            a.email,
                            a.created_on,
                            a.last_login
                       from accounts a
                      where a.user_id = ${id}
                   `
      client.query(sqlQry, (err, res) => {
        if (err) {
          console.log(err.stack)
          reject({ msg: 'Falha interno ao selecionar usuarios!' })
        }

        const user = res.rows[0]

        this.user_id = user.user_id
        this.username = user.username
        this.password = user.password
        this.email = user.email
        this.created_on = user.created_on
        this.last_login = user.last_login

        resolve()
        client.end()
      })
    })
  }

  this.validateUserExists = (username) => {
    return new Promise(async (resolve, reject) => {

      const client = new Client(configConnection)
      await client.connect()

      let sqlQry = ` select a.user_id
                       from accounts a
                      where upper(a.username) = upper('${username}')
                   `
      client.query(sqlQry, (err, res) => {
        if (err) {
          console.log(err.stack)
          reject({ msg: 'Falha ao vilidar usuario!' })
        }
        
        if (res.rows.length === 0) {
          resolve()
        }
        else {
          reject({ msg: 'Usuário já existente, tente outro username!' })
        }
        client.end()
      })

    })   
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

  this.register = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const profile = new Profile()
        profile.name = this.username
        const profile_id = await profile.register()
        const passCrypted = crypt.cryptPass(this.password)
    
        let sqlQry = ` INSERT INTO accounts (username, "password", email, profile_id)
                                   VALUES  ('${this.username}', '${passCrypted}', '${this.email}', ${profile_id})
                     `
        const client = new Client(configConnection)
        await client.connect()
        client.query(sqlQry, (err, res) => {
          if (err) {
            console.log(err.stack)
            reject({ msg: 'Falha interna ao inserir usuario!' })
          }
  
          client.end()
          resolve()
        })
      } catch (err) {
        console.log(err)
        reject({ msg: 'Falha interna!' })
      }
    })
  }
}

export default Users
