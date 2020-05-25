const knex = require('../../../database/connection.js')

function Invitations(id) {
  this.id          = id === undefined ? -1 : id
  this.contact_id  = 0

  this.getInvitations = () => {
    const id = this.id
    return new Promise(async (resolve, reject) => {
        knex
        .from("invitations")
        .select("contact_id")
        .where('user_id', '=', id)
        .then(profile => resolve( profile ))
        .catch(() => reject({ id: 0, msg: 'Error to select invitations!' }))
    })
  }

  this.getInvitationsDetailed = () => {
    const id = this.id
    return new Promise(async (resolve, reject) => {
        knex
        .from("accounts as a")
        .leftJoin("profiles as p", "p.profile_id", "a.profile_id")
        .leftJoin("invitations as i", "i.contact_id", "a.user_id")
        .select("i.contact_id", "p.full_name as name", "p.description", "p.image as picture")
        .where('i.user_id', '=', id)
        .then(profile => resolve( profile ))
        .catch(() => reject({ id: 0, msg: 'Error to select invites deteiled!' }))
    })    
  }

  this.remove = (idContact) => {
    return new Promise( async (resolve, reject) => {
      knex('invitations')
      .where('user_id', '=', id)
      .andWhere('contact_id', '=', idContact)
      .del()
      .then(() => resolve({ status: true }) )
      .catch(() => reject({ status: false }))
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
      .then(() => resolve({ status: true })) 
      .catch(() => reject({ msg: 'Error to execute insert in invitations!' }))
    })
  }
}

export default Invitations
