<img src="https://github.com/jeaanca/fort-team/blob/master/app/src/assets/img/logo-full.png"><br>

### Forty Team is a real-time conversation project

## About
This project has the ambition to build a chat in real time using socket.io in javascript.

The appearance is related to several studies that I conducted where it resulted in a project with the following stacks:

The project organization is based on the MVC model.

**Vue.js**: Framework used in the view layer
**Node.js**: Used to build the other two layers, Controller and Model.

The data is stored in a **postgres** database and the entire cache is made by **redis**, in redis the database user Id is linked to the socket id.

## Clone
Clone this repo to your local machine using https://github.com/jeaanca/forty-team <br>
cd forty-team <br>

## Configuration 
### server
  Add postgres configuration data to server <i>/src/connections/config-pg.js</i>

  npm install <br>
  npx knex migrate:latest <br>
  npm start

### app  
  cp .env.example .env <br>
  In the .env file add the key that will be used in the JWT.
  

  npm install <br>
  npm run serve

## Contributors

| [<img src="https://avatars0.githubusercontent.com/u/38164565?s=400&u=d4fb65931ff45a914df31ca97e017bbd7f6bb04d&v=4" width="110"><br><sub>@oLucasPopov</sub>](https://github.com/oLucasPopov) 
|:---: |

## Autor
| [<img src="https://avatars3.githubusercontent.com/u/30236552?v=4" width="110"><br><sub>@JeaanCa</sub>](https://github.com/jeaanca) |
| :---: |
