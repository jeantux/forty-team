import Profile from '../../models/fortyteam/profile/profile.js'
import binds from './binds'
async function sendMessage(user_id, data, socket) {   
    binds.getSocketId(data.id_contact)
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
                        binds.sendInvite(user_id, data.id_contact)
                }
            }
        })
        .catch(err => console.log(err))
}

export default {
    sendMessage
}