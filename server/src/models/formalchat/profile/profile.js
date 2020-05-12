const { Client } = require('pg')
import configConnection from '../../../connections/config-pg'

function Profile(id) {
  this.id          = id === undefined ? -1 : id
  this.name        = ''
  this.phone = ''
  this.description = ''

  this.getProfile = () => {
    let id = this.id
    return new Promise(async (resolve, reject) => {
      const client = new Client(configConnection)
      await client.connect()

      let sqlQry = `
        select p.full_name
              ,p.description
              ,p.image
          from account a
         inner join profile p on p.profile_id = a.profile_id
            where a.user_id = ${id}
      `
      client.query(sqlQry, (err, res) => {
        if (err) {
          console.log(err.stack)
          reject({ id: 0, msg: 'Falha interno ao selecionar contatos!' })
        }

        client.end()
        let profiles = res.rows[0]
        resolve( profiles )

      })
    })
  }

  this.register = () => {
    return new Promise( async (resolve, reject) => {
      let sqlQry = ` INSERT INTO profile (full_name, phone, description)
                                  VALUES ('${this.name}', '${this.phone}', '${this.description}')
                               RETURNING profile_id
                   `
      const client = new Client(configConnection)
      await client.connect()
      client.query(sqlQry, (err, res) => {
        if (err) {
          console.log(err.stack)
          reject({ msg: 'Falha interna ao inserir dados do perfil!' })
        }

        const profile_id = res.rows[0].profile_id

        client.end()      
        resolve(profile_id)
      })

    })
  }
  
}

export default Profile
