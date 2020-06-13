const connection = require('../../../database/connection')
const crypt = require('../../../methods/crypt.js')

function Auth() {
  async function selectUser(userId, username, password) {
    const newPassword = password !== undefined ? crypt.cryptPass(password) : ''

    try {
      const auth = await connection('accounts')
        .select('user_id',
          'username',
          'email',
          'last_login')
        .where(function () {
          if (userId === 0) {
            this.whereRaw(`upper(username) = '?'`, [connection.raw(username.toUpperCase())])
              .andWhere({ password: newPassword })
          } else {
            this.where({ user_id: userId })
          }
        })
      if (auth.length > 0) {
        const user = auth[0]
        return Promise.resolve({ user })
      } else {
        return Promise.reject({ msg: 'Falha ao executar sql!' })
      }
    } catch (e) {
      return Promise.reject({ msg: 'Falha ao executar sql!' })
    }
 
  }

  function getUserByLogin(username, password) {
    return selectUser(0, username, password)
  }

  function getUserById(id) {
    return selectUser(id)
  }

  return {
    getUserByLogin,
    getUserById
  }
}

export default Auth
