require("dotenv-safe").config();
import JWT from 'jsonwebtoken'
const SECRET = process.env.KEY_SECRET

function validToken (authorization, call) {
    const token = authorization ? authorization.split(' ')[1] : null

    if (!token)
        return false

    JWT.verify(token, SECRET, (err, decoded) => {
      if (err)
        return false

      call(decoded)
    })
}

export default validToken