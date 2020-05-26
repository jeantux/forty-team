const redis = require("redis");
import Messages from "../../models/fortyteam/messages/messages"
import Invitations from '../../models/fortyteam/invitations/invitations.js'

function registerMessageDatabase(user_id, data) {
    if (data.actionType === 'message') {
        const messages = new Messages(data.id_contact, user_id)
        messages.sendMessage(data.message)    
    }
}

function registerUserId(user_id, socket_id) {
    const client = redis.createClient()

    client.on('error', error => console.error(error))
    client.set(`user_id_acc_${user_id}`, socket_id)
}

function getSocketId(user_id) {
    return new Promise((resolve, reject) => {
        const client = redis.createClient()

        client.get(`user_id_acc_${user_id}`, (err, reply) => {
            if (err)
                reject(null)

            resolve(reply);
        });
    })
}

function sendInvite(idUser, idFrom) {
    const invite = new Invitations()
    invite.id = idFrom
    invite.contact_id = idUser
    invite.register()
}

export default {
    registerMessageDatabase,
    registerUserId,
    getSocketId,
    sendInvite
}