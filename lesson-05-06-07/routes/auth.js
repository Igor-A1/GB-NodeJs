const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../config')

function isAuth(req, res, next) {
  if (req.session.isAuth) {
    return next()
  }

  res.redirect('/auth/login')
}

function isNotAuth(req, res, next) {
    if (!req.session.isAuth) {
    return next()
  }

  res.redirect('/')
}

router.get('/login', isNotAuth, (req, res) => {
  res.render('login', {warning: req.flash('loginMessage') })
})

router.post('/login', isNotAuth, (req, res) => {
  if(!req.body.login || !req.body.password) {
    req.flash('loginMessage', 'Вы не ввели логин и/или пароль!')
    res.redirect('/auth/login')
  } else {
    User.model.findOne(({login: req.body.login}))
    .then(doc => {
      if (!doc) {
        req.flash('loginMessage', 'Пользователь с таким логином не найден!')
        res.redirect('/auth/login')
      } else if (!doc.isValidPassword(req.body.password)) {
        req.flash('loginMessage', 'Неверный пароль!')
        res.redirect('/auth/login')
      } else {
        req.session.isAuth = true
        req.session.userName = doc.fullname
        res.cookie('token', jwt.sign(doc.toJSON(), config.db.password))
        res.redirect('/')
      }
    })
  }
})

router.get('/signup', isNotAuth, (req, res) => {
  res.render('signup', {warning: req.flash('signupMessage')})
})

router.post('/signup', isNotAuth, (req, res) => {
  if(!req.body.login || !req.body.password) {
      req.flash('signupMessage', 'Введите логин и пароль!')
      res.redirect('/auth/signup')
  } else {
    User.model.findOne(({login: req.body.login}))
    .then(doc => {
      if(doc) {
        req.flash('signupMessage', 'Такой логин уже есть!')
        res.redirect('/auth/signup')
      } else {
        const newUser = new User.model()

        newUser._id = new (mongoose.Types.ObjectId)
        newUser.login = req.body.login
        newUser.password = newUser.genHash(req.body.password)
        newUser.fullname = req.body.fullname
        newUser.email = req.body.email
        newUser.save()

        req.session.isAuth = true
        req.session.userName = req.body.fullname
        res.redirect('/')
      }
    })
  }
})

router.get('/logout', isAuth, (req, res) => {
  req.session.destroy()
  res.clearCookie('token')
  res.redirect('../')
})

module.exports = router