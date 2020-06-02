import validToken from './validations'
import binds from './binds'
import messages from './messages'

function handlerSocket(io) {
    io.on('connection', socket => {
        socket.on('authenticate', data => {
            validToken(data.token, decoded => {
                binds.registerUserId(decoded.user.user_id, socket.id)
            })
        })

        socket.on('actionClient', data => {
            validToken(data.token, decoded => {
                if (decoded) {                       
                    messages.sendMessage(decoded.user.user_id, data, socket)
                }
            })  
        })
    })
} 

export default { handlerSocket }
