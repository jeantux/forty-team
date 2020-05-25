import configConnection from '../../../connections/config-pg'
const crypt = require('../../../methods/crypt.js')
const { Client } = require('pg')

function Auth() {
  function selectUser(userId, username, password){
    return new Promise(async (resolve, reject) => {
      let whereDefault = ''
      const newPassword = password !== undefined ? crypt.cryptPass(password) : ''

      const client = new Client(configConnection)

      if (userId === 0) {
        whereDefault = `  and upper(u.username) = upper('${username}')
                          and u.password = '${newPassword}'
                       `
      } else {
        whereDefault = `  and u.user_id = '${userId}' `
      }
                       
      let sqlQry = `  select u.user_id
                            ,u.username
                            ,u.email
                            ,u.last_login
                       from accounts u
                      where true
                            ${whereDefault}
                   `
      await client.connect()

      client.query(sqlQry, (err, res) => {
        if (err) {
          console.log(err.stack)
          reject({ msg: 'Falha ao executar sql!' })
        }
        
        if (res.rows.length > 0) {
          let user = res.rows[0]
          resolve({ user })
        } else {
          reject({ msg: 'Falha ao execuutar sql!' })
        }

        client.end()
      })

    })
  }
  
  function getUserByLogin (username, password) {
    return selectUser(0, username, password)
  }
  
  function getUserById (id) {
    return selectUser(id)
  }

  return {
    getUserByLogin,
    getUserById
  }
}

export default Auth
