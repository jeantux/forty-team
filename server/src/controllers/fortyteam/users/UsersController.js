import Users from '../../../models/fortyteam/users/users.js'

export default {
    registerUser(req, res) {
        const { username, password } = req.body
        const user = new Users()
        user.username = username
        user.password = password

        user.validate()
            .then(() => {
                user.register()
                .then(() => {
                    res.status(200).send({ message: 'Usuario inserido com sucesso!' })
                })
                .catch(err => {
                    res.status(500).send( { message: err.msg } )
                })
            })
            .catch(err => {
                res.status(500).send( { message: err.msg } )
            })

    }
}

