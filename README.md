# CNT
Node express app with personal to dos, notes

Attempting to make a public chat. As of now, I'm not using any front-end JavaScript frameworks like React or Angular.

Technologies being used

Backend
- Nodejs
- Express
- Socket.io
- Handlebars template engine
- Passport
- Mongoose
  
Database
- MongoDB

Frontend
- Materialize CSS
- CKEDITOR 5

Inside the configs folder, create a 'configs.env' file if you don't already have one. Then set the following ENV variables. Don't put the <>

```
PORT = <PORTNUMBERFORAPP>
MONGO_URI = mongodb://<username>:<password>@<host>:<port>/<dbname>
SESSIONSECRET=<MYSESSIONSECRET>
```
