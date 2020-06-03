import Profile from '../../../models/fortyteam/profile/profile.js'

export default {
    getProfile(req, res) {
        const profileModel = new Profile(req.data.user.user_id)
        profileModel.getProfile()
            .then(data => {
                res.status(200).send(
                    {profile: data}
                )
            })
            .catch(err => {
                res.status(200).send( { message: 'Fail to get perfil data.' } )
            })
    },
    saveDataProfile(req, res) {
        const profileModel = new Profile(req.data.user.user_id)
        profileModel.name = req.body.full_name
        profileModel.phone = req.body.phone
        profileModel.description = req.body.description
        profileModel.email = req.body.email

        profileModel.update()
            .then(() => {
                res.status(200).send( { message: 'success' } )
            })
            .catch(err => {
                res.status(500).send( { message: 'Fail to set perfil data.' } )
            })
    }
}

