const { Client } = require('pg')

function Messages(id, idUser) {
  this.id = id === undefined ? -1 : id
  this.idUser = idUser === undefined ? -1 : idUser
  this.getMessages = () => {
    let id = this.id
    return new Promise(async (resolve, reject) => {
    
      const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'fcdb',
        password: 'mainroot',
        port: 5432,
      })

      await client.connect()

      let sqlQry = ` select m.message_id,
                            m.message,
                            m.send_date,
                            m.user_id = ${idUser} as sent
                        from messages m
                        where m.user_id in (${idUser}, ${id})
                        and m.contact_id in (${idUser}, ${id})
                        order by m.message_id desc
                        limit 50
                  `

      client.query(sqlQry, (err, res) => {
        if (err) {
          console.log(err.stack)
          reject({ msg: 'Falha interno ao selecionar contatos!' })
        }

        let talks = []
        let tmpTalks = res.rows

        tmpTalks.sort(function(a,b) {
            return a.message_id < b.message_id ? -1 : a.message_id > b.message_id ? 1 : 0;
        });

        for (let message in tmpTalks) {
            let newTalk = {
                    method: res.rows[message].sent === true ? 'sent' : 'replies',
                    message: res.rows[message].message
               }
            talks.push(newTalk)
        }

        resolve({ talks  })

        client.end()
      })
    })
  }


  this.sendMessage = (message) => {
    return new Promise(async (resolve, reject) => {
    
      const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'fcdb',
        password: 'mainroot',
        port: 5432,
      })

      await client.connect()

      let sqlQry = ` INSERT INTO messages (user_id, contact_id, message, send_date)
                                   VALUES (${this.idUser}, ${this.id}, '${message}', current_timestamp);
                  `
      client.query(sqlQry, (err, res) => {
        if (err) {
          console.log(err.stack)
          reject({ msg: 'Falha ao enviar mensagem!' })
        }

        client.end()
        resolve()
      })
    })
  }
}

export default Messages
