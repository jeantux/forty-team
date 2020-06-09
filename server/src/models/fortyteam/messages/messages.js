const connection = require('../../../database/connection')

function Messages(id = -1, idUser = -1) {
  this.id = id
  this.idUser = idUser
  this.getMessages = async () => {
    try {
      let id = this.id
      const tmpTalks = await connection('messages')
        .select('message_id',
          'message',
          'send_date',
          'user_id'
        )
        .whereRaw('user_id in (?, ?)', [idUser, id])
        .andWhereRaw('contact_id in (?, ?)', [idUser, id])
        .orderBy('message_id', 'desc')
        .limit(50)

      let talks = []

      tmpTalks.sort(function (a, b) {
        return a.message_id < b.message_id ? -1 : a.message_id > b.message_id ? 1 : 0;
      })

      for (let item in tmpTalks) {
        let newTalk = {
          method: tmpTalks[item].user_id === idUser ? 'sent' : 'replies',
          message: tmpTalks[item].message
        }
        talks.push(newTalk)
      }

      return Promise.resolve({ talks })
    } catch (e) {
      return Promise.reject({ msg: 'Falha interna ao selecionar contatos!' })
    }
  }

  this.sendMessage = async (message) => {
    try {
      await connection('messages').insert({
        user_id: this.idUser,
        contact_id: this.id,
        message: message
      })
      return Promise.resolve()
    } catch (e) {
      return Promise.reject({ msg: 'Falha ao enviar mensagem!' })
    }
  }
}

export default Messages
