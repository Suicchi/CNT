const path = require('path')
const express = require('express');
const handlebars = require('express-handlebars')
const session = require('express-session')
const passport = require('passport')
const dotenv = require('dotenv')
const morgan = require('morgan')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const urlParser = bodyParser.urlencoded({extended:false})

// configs
dotenv.config({path: './configs/configs.env'})

// passport config
require('./configs/passport')(passport)

// db
const connectDB = require('./configs/db');
const MongoStore  = require('connect-mongo')(session);
connectDB()

const app = express()

if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}

// Use bodyparser
app.use(urlParser)

// parse application/json
app.use(bodyParser.json())

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))

// use express session
app.use(session({
    secret: process.env.SESSIONSECRET,
    resave:false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))
// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// for flash messages
app.use(flash())

// global variable
app.use((req, res, next)=> {
    res.locals.user = req.user || null
    next()
})

// Routes
app.use('/',require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/chat', require('./routes/chat'))
app.use('/notes', require('./routes/notes'))
app.use('/todo', require('./routes/todo'))

// handlebars helper functions
const {rmTags, showOnly, userIsAuthor, showDate, preSelect} = require('./helpers/hbs')

// handlebars
app.engine('.hbs', handlebars({default:'main', extname: '.hbs', helpers: {
    rmTags,
    showOnly,
    userIsAuthor,
    showDate,
    preSelect
}}));
app.set('view engine', '.hbs');

// static folders
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000

const server = app.listen(PORT,console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));
const io = require('socket.io')(server)

// Socket.io operations
require('./sockets/sockets')(io)