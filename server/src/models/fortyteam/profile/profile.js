const knex = require('../../../database/connection.js')

function Profile(id) {
  this.id          = id === undefined ? -1 : id
  this.name        = ''
  this.phone       = ''
  this.description = ''

  this.getProfile = () => {
    const id = this.id
    return new Promise(async (resolve, reject) => {
        knex
        .from("accounts as a")
        .leftJoin("profiles as p", "p.profile_id", "a.profile_id")
        .select("p.full_name", "p.description", "p.image")
        .where('a.user_id', '=', id)
        .first()
        .then(profile => resolve( profile ))
        .catch(() => reject({ id: 0, msg: 'Error to select profiles!' }))
    })
  }

  this.register = () => {
    return new Promise( async (resolve, reject) => {
      knex
      .insert({
        full_name: this.name,
        phone: this.phone,
        description: this.description
      })
      .into("profiles")
      .returning('profile_id')
      .then(profile => resolve(profile)) // add profile_id
      .catch(() => reject({ msg: 'Error to execute insert in profile!' }))
    })
  }
}

export default Profile
