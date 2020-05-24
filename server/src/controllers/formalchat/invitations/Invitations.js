import Invitations from '../../../models/formalchat/invitations/invitations.js'

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
    }
}

