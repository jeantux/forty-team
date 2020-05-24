const knex = require('../../../database/connection.js')

function Invitations(id) {
  this.id          = id === undefined ? -1 : id
  this.contact_id  = 0

  this.getInvite = () => {
    const id = this.id
    return new Promise(async (resolve, reject) => {
        knex
        .from("invitations")
        .select("contact_id")
        .where('user_id', '=', id)
        .first()
        .then(profile => resolve( profile ))
        .catch(() => reject({ id: 0, msg: 'Error to select invitations!' }))
    })
  }

  this.register = () => {
    return new Promise( async (resolve, reject) => {
      knex
      .insert({
        contact_id: this.contact_id,
        user_id: this.id
      })
      .into("invitations")
      .then(profile => resolve({ status: true })) 
      .catch(() => reject({ msg: 'Error to execute insert in invitations!' }))
    })
  }
}

export default Profile
