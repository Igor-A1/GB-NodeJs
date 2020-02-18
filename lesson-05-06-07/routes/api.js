const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const config = require('../config')
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

router.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if(token) {
    jwt.verify(token, config.db.password, (e, decoded) => {
      if(e) {
        console.log('!!! ERROR: Failed to authenticate token:', e)
        return res.json(
          {
            success: false, 
            message: 'ошибка при получении токена аутентификации' 
          }
        )
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    console.log('!!! ERROR: Authentication token not provided.')
    return res.status(403).send(
      {
        success: false,
        message: 'токен аутентификации отсутствует, вернитесь и повторите попытку'
      }
    )
  }
})

// REST :: CRUD :: CREATE
router.post('/notes', (req, res) => {
  let warning = ''
  if(req.body.title.trim().length < 2)
    warning += 'заголовок должен содержать больше букв'
  else
    if(req.body.body.trim().length < 2)
      warning += 'текст заметки должен содержать больше букв'
    else
      if(req.body.tags.trim().length < 2)
        warning += 'тэги должны содержать больше букв'
      
  if(warning.length > 0) {
    res.status(403).send({
      success: false,
      message: warning
    })
  } else {
    const newNote = new Note.model({
      _id: new (mongoose.Types.ObjectId),
      author: req.decoded._id,
      title: req.body.title,
      tags: req.body.tags
    })
    // can't save "body" property from constructor :( 
    // bug maybe ?
    newNote.body = req.body.body 

    newNote.save()
    .then(doc => res.json(
      {
        success: true,
        note: doc
      })
    )
    .catch(e => {
      console.log('!!! ERROR: New note not saved:', e)
      res.status(404).send(
        {
          success: false,
          message: 'ошибка при сохранении заметки, вернитесь и повторите попытку'
        })
    })
  }
})

// REST :: CRUD :: READ
router.get('/notes', (req, res) => {
  // using signed cookie
  let _user = req.decoded
  let filter = {}
  if(_user._id !== User.root._id)
    filter.author = _user._id
  
  Note.model.find(filter).sort({date: -1})
  .then(docs => res.json(
    {
      success: true, 
      notes: docs ? docs : []
    })
  )
  .catch(e => {
    console.log('!!! ERROR: Notes not founded:', e)
    res.status(404).send(
      {
        success: false,
        message: 'ошибка при получении заметок, вернитесь и повторите попытку'
      })
  })
})

router.get('/notes/:id', (req, res) => {
  Note.model.findById(req.params.id)
  .then(doc => res.json(
    {
      success: true,
      note: doc 
    })
  )
  .catch(e => {
    console.log(`!!! ERROR: Note id ${req.params.id} not founded:`, e)
    res.status(404).send(
      {
        success: false,
        message: 'ошибка при получении заметки, вернитесь и повторите попытку'
      })
  })
})

// REST :: CRUD :: UPDATE
router.put('/notes/:id', (req, res) => {
  let warning = ''
  if(req.body.title.length < 2)
    warning += 'заголовок должен содержать больше букв'
  else 
    if(req.body.body.length < 2)
      warning += 'текст заметки должен содержать больше букв'
    else 
      if(req.body.tags.length < 2)
        warning += 'тэги должны содержать больше букв'
  
  if(warning.length > 0) {
    res.status(403).send({
      success: false,
      message: warning
    })
  } else {
    const filter = {_id: req.params.id}
    const newContent = {
      title: req.body.title, 
      date: new Date(),
      tags: req.body.tags
    }
    newContent.body = req.body.body
    
    Note.model.updateOne(filter, newContent)
    .then(status => res.json(
      {
        success: true,
        warning: status 
      })
    )
    .catch(e => {
      console.log(`!!! ERROR: Note id ${req.params.id} not updated:`, e)
      res.status(404).send(
        {
          success: false,
          message: 'ошибка при обновлении заметки, вернитесь и повторите попытку'
        })
    })
  }
})

// REST :: CRUD :: DELETE
router.delete('/notes/:id', (req, res) => {
  if(!req.params.id) {
    res.status(403).send(
      {
        success: false,
        message: 'идентификатор заметки отсутствует?'
      }
    )
  } else {
    Note.model.deleteOne({_id: req.params.id})
    .then(status => res.json(
      {
        success: true,
        status: status
      })
    )
    .catch(e => {
      console.log(`!!! ERROR: Note id ${req.params.id} not removed:`, e)
      res.status(404).send(
        {
          success: false,
          message: 'ошибка при удалении заметки, вернитесь и повторите попытку'
        })
    })
  }
})

module.exports = router