import Profile from '../../models/fortyteam/profile/profile.js'
import binds from './binds'

function sendEvent(socket, socket_id_send, action, obj) {
    socket.broadcast.to(socket_id_send).emit(action, obj)
}

async function sendMessage(user_id, data, socket) {   
    binds.getSocketId(data.id_contact)
        .then(socket_id => {
            if (data.actionType === 'messages') {
                sendEvent(socket, socket_id, data.actionType, { id_contact: user_id, message: data.message })
                binds.registerMessageDatabase(user_id, data.id_contact, data.message)
            }

            else if (data.actionType === 'typing') {
                sendEvent(socket, socket_id, data.actionType, { id_contact: user_id, typing: true })
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
                        sendEvent(socket, socket_id, data.actionType, dataReturn)
                    })
                binds.sendInvite(user_id, data.id_contact)
            }

        })
        .catch(err => console.log(err))
}

export default {
    sendMessage
}