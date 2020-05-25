import JWT from 'jsonwebtoken'
import Messages from "../../models/fortyteam/messages/messages"
import Profile from '../../models/fortyteam/profile/profile.js'
import Invitations from '../../models/fortyteam/invitations/invitations.js'
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

function registerMessageDatabase(user_id, data) {
    if (data.actionType === 'message') {
        const messages = new Messages(data.id_contact, user_id)
        messages.sendMessage(data.message)    
    }
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

async function sendMessage(user_id, data, socket) {   
    getSocketId(data.id_contact)
        .then(socket_id => {
            if (socket_id) {
                if (data.actionType === 'message')
                    socket.broadcast.to(socket_id).emit('messages', { id_contact: user_id, message: data.message })

                else if (data.actionType === 'typing') {
                    socket.broadcast.to(socket_id).emit('typing', { id_contact: user_id, typing: true })
                }
                else if (data.actionType === 'adduser') {
                    const profileModel = new Profile(user_id)
                    profileModel.getProfile()
                        .then(currentProfile => {
                            const dataReturn = {
                                id_contact: user_id,
                                name: currentProfile.full_name,
                                picture: currentProfile.image
                            }
                            socket.broadcast.to(socket_id).emit('adduser', dataReturn)
                        })
                        sendInvite(user_id, data.id_contact)
                }
            }
        })
        .catch(err => console.log(err))
}

function sendInvite(idUser, idFrom) {
    const invite = new Invitations()
    invite.id = idFrom
    invite.contact_id = idUser
    invite.register()
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
                    registerMessageDatabase(decoded.user.user_id, data)                        
                    sendMessage(decoded.user.user_id, data, socket)
                }
            })  
        })
    })
} 

export default { handlerSocket }
