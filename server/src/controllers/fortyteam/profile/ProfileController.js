import Profile from '../../../models/fortyteam/profile/profile.js'

export default {
    profile(req, res) {
        const profileModel = new Profile(req.data.user.user_id)
        profileModel.getProfile()
            .then(data => {
                res.status(200).send(
                    {profile: {name: data.full_name, img: data.image}}
                )
            })
            .catch(err => {
                res.status(200).send( { message: 'Fail to get perfil data.' } )
            })
    }
}

