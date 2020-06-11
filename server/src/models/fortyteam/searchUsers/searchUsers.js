const { Client } = require('pg')
import configConnection from '../../../connections/config-pg'
const connection = require('../../../database/connection')


function SearchUsers(id = -1, textSearch = '') {
  this.id = id
  this.textSearch = textSearch

  this.getUsers = async () => {
    let id = this.id
    let textSearch = this.textSearch.toUpperCase()
   
    try {
      const users = await connection('accounts')
        .distinct(
          connection.ref('accounts.user_id').as('id_contact'),
          connection.ref('profiles.full_name').as('name'),
          'profiles.description',
          'profiles.image',
          connection.raw('not(contacts.user_id is null) as mycontact'),
          connection.raw('not(invitations.contact_id is null) as invitePending')
        )
        .innerJoin('profiles', 'profiles.profile_id', 'accounts.profile_id')
        .leftJoin('invitations', function () {
          this.on('invitations.user_id', 'accounts.user_id').andOn('invitations.contact_id', id)
        })
        .leftJoin('contacts', function () {
          this.on('contacts.user_id', id).andOn('contacts.contact_id', 'accounts.user_id')
        })
        .where('accounts.user_id', '<>', id)
        .andWhere(function () {
          if (textSearch) {
            this.whereRaw("upper(profiles.full_name) like '%?%'", [connection.raw(textSearch)])
              .orWhereRaw("upper(accounts.username) like '%?%'", [connection.raw(textSearch)])
          }
        })

      return Promise.resolve({ users })
    } catch (e) {
      return Promise.reject({ msg: 'Falha interna ao selecionar contatos!' })
    }

  }
}

export default SearchUsers
