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

      // if private accout
      let where = ` and (
                         upper(p.full_name) like upper('%${textSearch}%')
                      or upper(a.username) like upper('%${textSearch}%')
                        )
                  `
      let sqlQry = `  select p.full_name as name
                            ,p.description
                            ,p.image 
                            ,not c.user_id is null as mycontact
                        from account       a
                      inner join profile  p on p.profile_id = a.profile_id
                        left join contacts c on c.user_id = ${id}
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
