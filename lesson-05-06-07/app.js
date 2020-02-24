console.log('---> wait, please: lo-o-ong app initialization on first run...')

const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.options('*', cors())

const path = require('path')
app.use(express.static(path.join(__dirname, 'assets')))

const templating = require('consolidate')
app.engine('hbs', templating.handlebars)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))

const config = require('./config')
const mongoose = require('mongoose')

const session = require('express-session')
const store = require('connect-mongo')(session)

const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const passport = require('passport') // global

require('./passport')(passport) // local
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())


const connString = `mongodb+srv://${config.db.user}:${config.db.password}@` +
  `${config.db.cluster}-7ykbr.mongodb.net/${config.db.db}?retryWrites=true&w=majority`
const connOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }

mongoose.connection.on('connected', () => {  
  console.log('---> mongoose default connection opened.')
}) 
mongoose.connection.on('error', e => {  
  console.log(`-!!!- mongoose default connection error: ${e}`)
}) 
mongoose.connection.on('disconnected', () => {  
  console.log('<--- mongoose default connection disconnected.')
})
process.on('SIGTERM', () => {  
  mongoose.connection.close(() => { 
    console.log('<--- SIGTERM: mongoose default connection disconnected through app termination.')
    process.exit(0)
  })
})
process.on('SIGINT', () => {  
  mongoose.connection.close(() => { 
    console.log('<--- SIGINT: mongoose default connection disconnected.')
    process.exit(0)
  })
})
process.on('SIGKILL', () => {  
  mongoose.connection.close(() => { 
    console.log('<--- SIGKILL: mongoose default connection disconnected.')
    process.exit(0)
  })
})

async function startBackend() {
  const backend = mongoose.connect(connString, connOpts)
  
  await backend
    .then(() => {
      console.log('---> connected to mongoose database.')
      
      app.use(cookieParser('used for signing cookies'))
      
      app.use(session({
        secret: 'used to sign the session ID cookie',
        resave: false,
        saveUninitialized: true,
        cookie: {
          path: '/',
          httpOnly: true,
          maxAge: 1000*60*60*24*7 // one week
        },
        store: new store({mongooseConnection: mongoose.connection})
      }))
      
      app.use('/', require('./routes/index'))
      app.use('/api', require('./routes/api'))
      app.use('/auth', require('./routes/auth'))
      
      app.listen(config.serve.port, () =>
        console.log(`---> [${new Date().toLocaleTimeString()}]` +
          ` backend started on "${config.serve.url}:${config.serve.port}"`)
      )
    })
    .catch(e => {
      console.log('!!! ERROR on backend starting:', e)
      mongoose.connection.close(() => { 
        console.log('<--- mongoose connection closed.')
        process.exit(0)
      })
    })
}

startBackend()
