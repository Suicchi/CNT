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

// Routes
app.use('/',require('./routes/index'))
app.use('/auth', require('./routes/auth'))


// handlebars
app.engine('.hbs', handlebars({default:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// static folders
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000

app.listen(PORT,console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));