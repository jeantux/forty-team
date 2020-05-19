import JWT from 'jsonwebtoken'
import Auth from '../../../models/formalchat/auth/auth'
require("dotenv-safe").config();

const SECRET = process.env.KEY_SECRET

export default {
  authenticate (req, res) {
    const { username, password } = req.body
    const auth = new Auth()

    auth.getUserByLogin(username, password)
    .then(user => {
      if (user) {

        const token = JWT.sign(user, SECRET, {
          expiresIn: 24000
        })
          
        res.status(200).send({ message: 'Login realizado com sucesso!', token, user })
  
        return
      }
    })
    .catch(err => {
      res.status(500).send({ message: 'Usuário ou senha invalidos!!' })
    })
  },

  validateSession (req, res, next) {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null

    if (!token) {
      res.status(400).send({ message: 'Sua sessão é inválida ou está expirada!' })
      return
    }

    JWT.verify(token, SECRET, (err, decoded) => {
      if (err) {
        res.status(400).send({ message: 'Sua sessão é inválida ou está expirada!' })
      }

      req.data = decoded

      next()
    })
  },

  loadSession (req, res) {
    const token = req.headers.authorization.split(' ')[1]
    const auth = new Auth()

    JWT.verify(token, SECRET, (err, decoded) => {
      if (err) {
        res.status(400).send({ message: 'Sua sessão é inválida ou está expirada!' })
        return
      }

      auth.getUserById(decoded.user.user_id).then(currentUser => {
        res.status(200).send({
          token,
          user: currentUser
        })
      })
    })
  }
}
