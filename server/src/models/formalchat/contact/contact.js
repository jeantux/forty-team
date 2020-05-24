import configConnection from '../../../connections/config-pg'
const { Client } = require('pg')

function Contact(id) {
  this.id = id === undefined ? -1 : id
  this.getContacts = () => {
    let id = this.id
    return new Promise(async (resolve, reject) => {
    
      const client = new Client(configConnection)

      await client.connect()

      let sqlQry = `
        select c.contact_id,
                p.full_name,
                p.description,
                p.image
            from contacts c
            inner join accounts a on a.user_id = c.contact_id
            inner join profiles  p on p.profile_id = a.profile_id
            where c.user_id = ${id}
      `
      client.query(sqlQry, (err, res) => {
        if (err) {
          console.log(err.stack)
          reject({ msg: 'Falha interno ao selecionar contatos!' })
        }

        let contacts = []

        for (let contact in res.rows) {
            let newContact = {
                id_contact: res.rows[contact].contact_id,
                name: res.rows[contact].full_name,
                description: res.rows[contact].description,
                picture: res.rows[contact].image,
                notification: false,
                typing: false,
                talks: []
            }
            contacts.push(newContact)
        }

        resolve({ contacts })

        client.end()
      })

    })
  }

}

export default Contact
