const connection = require('../../../database/connection')

function Profile(id) {
  this.id = id === undefined ? -1 : id
  this.name = ''
  this.phone = ''
  this.description = ''
  this.email = ''
  this.image = ''

  this.getProfile = async () => {
    const id = this.id

    try {
      const profile = await connection('accounts as a')
        .select("p.full_name", "p.description", "p.image", "p.email")
        .leftJoin("profiles as p", "p.profile_id", "a.profile_id")
        .whereRaw('a.user_id = (?)', id)
        .first()

      return Promise.resolve(profile)
    } catch (e) {
      return Promise.reject({ id: 0, msg: 'Error while selecting profile!' })
    }
  }

  this.register = async () => {
    try {
      const [profile_id] = await connection('profiles')
        .returning('profile_id')
        .insert({
          full_name: this.name,
          phone: this.phone,
          description: this.description,
          email: this.email
        })

      return Promise.resolve(profile_id)
    } catch (e) {
      return Promise.reject({ msg: 'Error to execute insert in profile!' })
    }
  }

  this.update = async () => {
    const id = this.id
    try {
      const [profile_id] = await connection('profiles')
        .returning('profile_id')
        .update({
          full_name: this.name,
          phone: this.phone,
          description: this.description,
          email: this.email
        })
        .whereRaw('profile_id = (?)', id)

      return Promise.resolve(profile_id)
    } catch (e) {
      return Promise.reject({ msg: 'Error to execute update in profile!' })
    }
  }

  this.updateImage = async () => {
    const id = this.id
    try {
      const [profile_id] = await connection('profiles')
        .returning('profile_id')
        .update({
          image: this.image
        })
        .whereRaw('profile_id = (?)', id)

      return Promise.resolve(profile_id)
    } catch (e) {
      return Promise.reject({ msg: 'Error to execute update in profile!' })
    }
  }
}

export default Profile
