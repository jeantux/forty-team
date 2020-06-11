// import connection from '../../../database/connection.js'

const connection = require('../../../database/connection.js')

function Invitations(id = -1) {
  this.id = id
  this.contact_id = 0

  this.getInvitations = async () => {
    const id = this.id

    try {
      const profile = await connection('invitations')
        .select('contact_id')
        .where('user_id', id)
      return Promise.resolve(profile)
    } catch (e) {
      return Promise.reject({ id: 0, msg: 'Error selecting invitations!' })
    }

  }

  this.getInvitationsDetailed = async () => {
    const id = this.id
    try {
      const profile = await connection('accounts')
        .leftJoin('profiles', 'profiles.profile_id', 'accounts.profile_id')
        .leftJoin('invitations', 'invitations.contact_id', 'accounts.user_id')
        .select('invitations.contact_id', 'profiles.full_name as name', 'profiles.description', 'profiles.image as picture')
        .where('invitations.user_id', '=', id)

      return Promise.resolve(profile)
    } catch (e) {
      return Promise.reject({ id: 0, msg: 'Error selecting detailed invitations' })
    }

  }

  this.remove = async (idContact) => {
    try {
      await connection('invitations')
        .where('user_id', id)
        .andWhere('contact_id', idContact)
        .delete()
      return Promise.resolve({ status: true })
    } catch (e) {
      return Promise.reject({ status: false })
    }
  }

  this.register = async () => {
    try {
      await connection('invitations').insert({
        contact_id: this.contact_id,
        user_id: this.id
      })
      return Promise.resolve({ status: true })
    } catch (e) {
      return Promise.reject({ msg: 'Error inserting invitations!' })
    }
  }
}

export default Invitations
