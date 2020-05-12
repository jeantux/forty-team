import AuthController from './controllers/formalchat/auth/AuthController'
import ContactsController from './controllers/formalchat/contacts/ContactsController'
import ProfileController from './controllers/formalchat/profile/ProfileController'
import MessagesController from './controllers/formalchat/messages/MessagesController'
import SerchUsers from './controllers/formalchat/searchUsers/SearchUsersController'
import Users from './controllers/formalchat/users/UsersController'

export default function (app) {
  app.get('/', (req, res) => {
    res.status(200).send({
      message: 'Hello - wellcome to fortyTeam',
      version: '1.0.0.0'
    })
  })

  app.post('/formalchat/login', AuthController.authenticate)
  app.post('/formalchat/register-user', Users.registerUser)
  
  app.post('/formalchat/load-session', AuthController.validateSession, AuthController.loadSession)
  app.get('/formalchat/contactslist', AuthController.validateSession, ContactsController.contactsList)
  app.get('/formalchat/profile', AuthController.validateSession, ProfileController.profile)
  app.get('/formalchat/messages', AuthController.validateSession, MessagesController.messages)
  app.post('/formalchat/sendmessage', AuthController.validateSession, MessagesController.sendMessage)
  app.get('/formalchat/search-users', AuthController.validateSession, SerchUsers.userList)

  app.use((req, res) => {
    res.status(404).send({ error: '404 - Not found' })
  })  
}
