import Invitations from '../../../models/formalchat/invitations/invitations.js'
import Contact from '../../../models/formalchat/contact/contact.js'

export default {
    getInvitations(req, res) {
        const invitationsModel = new Invitations(req.data.user.user_id)
        invitationsModel.getInvitationsDetailed()
            .then(invitations => {
                res.status(200).send( invitations )
            })
            .catch(err => {
                console.log(err)
                res.status(200).send( { message: 'Fail to get invite data.' } )
            })
    },
    accept(req, res) {
        const idContact = req.body.id_contact
        const invitationsModel = new Invitations(req.data.user.user_id)
        invitationsModel.remove(idContact)
            .then(() => {
                const contact = new Contact(req.data.user.user_id)
                contact.add(idContact)
                .then(() => {
                    res.status(200).send({ status: true })
                })
                .catch(() => {
                   res.status(200).send({ message: 'Fail to accept invite with detail.' })
                })
                
            })
            .catch(err => {
                console.log(err)
                res.status(200).send({ message: 'Fail to accept invite data.' })
            })
    },
    reject(req, res) {
        const idContact = req.body.id_contact
        const invitationsModel = new Invitations(req.data.user.user_id)
        invitationsModel.remove(idContact)
            .then(() => {
                res.status(200).send({ status: true })
            })
            .catch(err => {
                console.log(err)
                res.status(200).send({ message: 'Fail to remove invite.' })
            })
    }
}

