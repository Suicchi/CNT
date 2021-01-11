const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const passport = require('passport')
const dotenv = require('dotenv')
const morgan = require('morgan')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const favicon = require('serve-favicon')
const socketIo = require('socket.io')

const urlParser = bodyParser.urlencoded({ extended: false })

// configs
dotenv.config({ path: './configs/configs.env' })

// passport config
require('./configs/passport')(passport)

// db
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./configs/db')

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// Use bodyparser
app.use(urlParser)

// parse application/json
app.use(bodyParser.json())

app.use(
	// eslint-disable-next-line consistent-return
	methodOverride((req) => {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			// look in urlencoded POST bodies and delete it
			// eslint-disable-next-line no-underscore-dangle
			const method = req.body._method
			// eslint-disable-next-line no-underscore-dangle
			delete req.body._method
			return method
		}
	}),
)

// use express session
const sessionMiddleware = session({
	secret: process.env.SESSIONSECRET,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
	}),
})

app.use(sessionMiddleware)

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// for flash messages
app.use(flash())

// global variable
app.use((req, res, next) => {
	res.locals.user = req.user || null
	next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/chat', require('./routes/chat'))
app.use('/notes', require('./routes/notes'))
app.use('/todo', require('./routes/todo'))

// handlebars helper functions
const {
	rmTags,
	showOnly,
	userIsAuthor,
	showDate,
	preSelect,
} = require('./helpers/hbs')

// handlebars
app.engine(
	'.hbs',
	handlebars({
		default: 'main',
		extname: '.hbs',
		helpers: {
			rmTags,
			showOnly,
			userIsAuthor,
			showDate,
			preSelect,
		},
	}),
)
app.set('view engine', '.hbs')

// static folders
app.use(express.static(path.join(__dirname, 'public')))

// serve favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

const PORT = process.env.PORT || 5000

const server = app.listen(
	PORT,
	console.log(
		`aaaServer running on ${process.env.NODE_ENV} mode on port ${PORT}`,
	),
)
const io = socketIo(server).use((socket, next) => {
	sessionMiddleware(socket.request, {}, next) // Passes the user data from passport to socket server
})

// Socket.io operations
require('./configs/sockets')(io)
