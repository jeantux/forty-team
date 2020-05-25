import Search from '../../../models/fortyteam/searchUsers/searchUsers'

export default {
    userList(req, res) {
        const { textSearch } = req.query
        const search = new Search(req.data.user.user_id, textSearch)
        search.getUsers()
            .then(( users ) => {
                res.status(200).send(users)
            })
            .catch(( err ) => {
                res.status(500).send(err.message)
            })        
    }
}
