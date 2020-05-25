import Messages from '../../../models/fortyteam/messages/messages'

export default {
    messages(req, res) {
        const { contactId } = req.query
        const messages = new Messages(contactId, req.data.user.user_id)
        messages.getMessages()
            .then((msgs) => {
                res.status(200).send(msgs)
            })
            .catch(err => {
                res.status(500).send(err.message)
            })        
    },
    sendMessage(req, res) {
        const { contactId, message } = req.body
        const messages = new Messages(contactId, req.data.user.user_id)
        messages.sendMessage(message)
            .then(() => {
                res.status(200).send({success: true})
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    }
}

