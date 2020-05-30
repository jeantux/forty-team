const { Client } = require('pg')
import configConnection from '../../../connections/config-pg'


function SearchUsers(id, textSearch) {
  this.id = id === undefined ? -1 : id
  this.textSearch = textSearch === undefined ? '' : textSearch

  this.getUsers = () => {
    let id = this.id
    let textSearch = this.textSearch
    return new Promise(async (resolve, reject) => {
    
      const client = new Client(configConnection)
      await client.connect()

      let where = ` and (
                         upper(p.full_name) like upper('%${textSearch}%')
                      or upper(a.username) like upper('%${textSearch}%')
                        )
                  `
      // remove distinct after add validations to not duplicate record in invitations
      let sqlQry = `  select distinct on (a.user_id)
                             a.user_id as id_contact
                            ,p.full_name as name
                            ,p.description
                            ,p.image
                            ,not c.user_id is null    as mycontact
                            ,not i.contact_id is null as invitePending
                        from accounts          a
                       inner join profiles     p on p.profile_id = a.profile_id
                        left join invitations  i on i.user_id = a.user_id
                                                and i.contact_id = ${id}
                        left join contacts     c on c.user_id = ${id}
                                                and c.contact_id = a.user_id
                      where a.user_id <> ${id}
                      ${where}
                   `
      client.query(sqlQry, (err, res) => {
        if (err) {
          console.log(err.stack)
          reject({ msg: 'Falha interno ao selecionar contatos!' })
        }

        const users = res.rows
        resolve({ users })

        client.end()
      })

    })
  }

}

export default SearchUsers