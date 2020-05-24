const knex = require('../../../database/connection.js')

function Contact(id) {
  this.id_user = id === undefined ? -1 : id

  this.getContacts = () => {
    let id = this.id_user

    return new Promise(async (resolve, reject) => {
    
      knex
      .from("contacts as c")
      .innerJoin("accounts as a", "a.user_id", "c.contact_id")
      .innerJoin("profiles as p","p.profile_id", "a.profile_id")
      .select("c.contact_id", "p.full_name", "p.description", "p.image")
      .where('c.user_id', '=', id)
      .then(allContacts => {
        let contacts = []

        for (let contact in allContacts) {
            let newContact = {
                id_contact: allContacts[contact].contact_id,
                name: allContacts[contact].full_name,
                description: allContacts[contact].description,
                picture: allContacts[contact].image,
                notification: false,
                typing: false,
                talks: []
            }
            contacts.push(newContact)
        }

        resolve({ contacts })
      })
      .catch(() => reject({ id: 0, msg: 'Error to select contacts!' }))

    })
  }

  this.add = (contact_id) => {
    return new Promise((resolve, reject) => {
      knex
      .insert([
        { contact_id: this.id_user, user_id: contact_id },
        { contact_id: contact_id, user_id: this.id_user }
      ])
      .into("contacts")
      .then(() => resolve({ status: true })) 
      .catch(() => reject({ msg: 'Error to execute insert in contact!' }))
    })
  }

}

export default Contact
