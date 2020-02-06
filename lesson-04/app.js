const express = require('express')
const app = express()

const path = require('path')
app.use(express.static(path.join(__dirname, 'assets')))

const templating = require('consolidate')
app.engine('hbs', templating.handlebars)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use('/', require('./routes/index'))
app.use('/load', require('./routes/load'))

const server = require('./modules/server')
app.listen(server.port)
console.log(`---> [${new Date().toLocaleTimeString()}] server starting at "${server.url}:${server.port}"`)
