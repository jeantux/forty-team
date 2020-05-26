import Cors from 'cors'
import express from 'express'
import routes from './routes'
import handlerSocketIo from './controllers/handlerSocket/handlerSocket.js'
import bodyParser from 'body-parser'
import preflight from './methods/preflight'

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(preflight.setHeaders)

app.use(Cors({
  allowedHeaders: ['Device', 'Content-Type', 'Authorization', 'Bearer'],
  exposedHeaders: []
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

routes(app)
handlerSocketIo.handlerSocket(io)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server domtec is running on port: ${PORT}`))