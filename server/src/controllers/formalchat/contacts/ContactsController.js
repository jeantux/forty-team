import Contacts from '../../../models/formalchat/contact/contact'

export default {
    contactsList(req, res) {
        const contact = new Contacts(req.data.user.user_id)
        contact.getContacts()
            .then((contacts) => {
                res.status(200).send(contacts)
            })
            .catch((err) => {
                res.status(500).send(err.message)
            })        
    }
}
