const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')

const fetch = require('node-fetch')
const config = require('../config.json')
const url = `${config.serve.url}:${config.serve.port}`

let weekday = 'воскресенье,понедельник,вторник,среда,четверг,пятница,суббота'.split(',')
let month = 'января,февраля,марта,апреля,мая,июня,июля,августя,сентября,октября,ноября,декабря'.split(',')
let lead0 = n => n > 9 ? n : '0' + n  
function localDate(d) {
  let s = `${weekday[d.getDay()]}`
  s += `, ${d.getDate()}`
  s += ` ${month[d.getMonth()]}`
  s += ` ${d.getFullYear()}`
  s += ` ${lead0(d.getHours())}`
  s += `:${lead0(d.getMinutes())}`
  return s
}


function isAuth(req, res, next) {
  if(req.session.isAuth) {
    return next()
  }

  res.redirect('/login')
}

// REST :: CRUD :: CREATE
router.get('/add', isAuth, (req, res) => {
  res.render('note', {userName: req.session.userName, action: '/add'})
})

router.post('/add', isAuth, (req, res) => {
  const body = 
    `title=${req.body.title}` +
    `&date=${req.body.date}` +
    `&body=${req.body.body}` +
    `&tags=${req.body.tags}`

  fetch(`${url}/api/notes`, {
    method: 'POST',
    body: body,
    headers: {
      'x-access-token': req.cookies.token,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.from(body).length
    }
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) 
      res.redirect('/')
    else
      res.render('note', {userName: req.session.userName, warning: data.message})
  })
})

// REST :: CRUD :: READ
router.get('/', (req, res) => {
  if(!req.cookies.token) {
    req.cookies.token = jwt.sign(User.guest, config.db.password)
  }
  
  const user = {}
  
  fetch(`${url}/api/notes`, {
    method: 'GET',
    headers: {'x-access-token': req.cookies.token}
  })
  .then(response => response.json())
  .then(data => {
    user.isAuth = req.session.isAuth
    user.userName = user.isAuth ? req.session.userName : 'Гость'
    
    if(data.success) {
      user.notes = data.notes
      // https://github.com/wycats/handlebars.js/issues/1642
      // user.notes = data.notes.map(d => d.toJSON()) 
      user.notes.forEach((n, i) => {
        n.even = i % 2 === 1
        n.ruDate = localDate(new Date(n.date)) 
      })
    } else {
      user.warning = data.message
    }
    res.render('index', user)
  })
})

// REST :: CRUD :: UPDATE
router.get('/edit', isAuth, (req, res) => {
  fetch(`${url}/api/notes/${req.query.id}`, 
    {
      method: 'GET',
      headers: {'x-access-token': req.cookies.token}
    })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      res.render('note', {userName: req.session.userName, data: data.note, action: '/edit'})
    } else {
      res.render('index', {warning: data.message})
    }
  })
})

router.post('/edit', isAuth, (req, res) => {
  const body = 
    `title=${req.body.title}` +
    `&date=${req.body.date}` +
    `&body=${req.body.body}` +
    `&tags=${req.body.tags}`

  fetch(`${url}/api/notes/${req.body.id}`, 
    {
      method: 'PUT',
      body: body,
      headers: {
        'x-access-token': req.cookies.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.from(body).length
      }
    })
  .then(response => response.json())
  .then(data => {
    if(data.success) 
      res.redirect('/')
    else
      res.render('note', {warning: data.message})
  })
})

// REST :: CRUD :: DELETE
router.get('/delete', isAuth, (req, res) => {
  fetch(`${url}/api/notes/${req.query.id}`, 
    {
      method: 'DELETE',
      headers: {'x-access-token': req.cookies.token}
    }
  )
  .then(response => response.json())
  .then(data => res.redirect('/'))
})

module.exports = router