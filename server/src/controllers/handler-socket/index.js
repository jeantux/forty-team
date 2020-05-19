import JWT from 'jsonwebtoken'
import Messages from "../../models/formalchat/messages/messages"
require("dotenv-safe").config();
const redis = require("redis");

const SECRET = process.env.KEY_SECRET

function validToken (authorization, call) {
    const token = authorization ? authorization.split(' ')[1] : null

    if (!token) {
        return false
    }

    JWT.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return false
      }

      call(decoded)
    })
}

function registerMessageDatabase(user_id, id_contact, message) {
    const messages = new Messages(id_contact, user_id)
    messages.sendMessage(message)    
}

function registerUserId(user_id, socket_id) {
    console.log(`register user: ${user_id} - ${socket_id}`)
    const client = redis.createClient()

    client.on('error', function(error) {
        console.error(error)
    })
    client.set(`user_id_acc_${user_id}`, socket_id)
}

function unregisterSocketId(socket_id) {
    // inplement
}

function getSocketId(user_id) {
    return new Promise((resolve, reject) => {
        const client = redis.createClient()

        client.get(`user_id_acc_${user_id}`, function(err, reply) {
            if (err) {
                reject(null)
            }
            resolve(reply);
        });
    })
}

async function sendMessage(user_id, contact_id, message, socket, actionType) {    
    getSocketId(contact_id)
        .then(socket_id => {
            if (socket_id) {
                if (actionType === 'message')
                    socket.broadcast.to(socket_id).emit('messages', { id_contact: user_id, message })

                else if (actionType === 'typing') {
                    socket.broadcast.to(socket_id).emit('typing', { id_contact: user_id, typing: true })
                }
            }
        })
        .catch(err => console.log(err))
}

function handlerSocket(io) {
    io.on('connection', socket => {
        socket.on('authenticate', data => {
            validToken(data.token, decoded => {
                registerUserId(decoded.user.user_id, socket.id)
            })
        })

        socket.on('disconnect', data => {
            console.log(`desconectado, id: ${socket.id}`)
        })

        socket.on('actionClient', data => {
            validToken(data.token, decoded => {
                if (decoded) {
                    if (data.actionType === 'message')
                        registerMessageDatabase(decoded.user.user_id, data.id_contact, data.message)
                    sendMessage(decoded.user.user_id, data.id_contact, data.message, socket, data.actionType)
                }
            })  
        })
    })
} 

export default { handlerSocket }
