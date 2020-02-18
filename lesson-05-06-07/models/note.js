const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const NoteSchema = new Schema({
  _id: Schema.Types.ObjectId,
  author: { 
      type: Schema.Types.ObjectId, 
      required: true,
      ref: 'User'
  },
  title: {
    type: String,
    required: true,
    minlength: [2, 'строка меньше 2 символов'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  body: {
    type: String,
    minlength: [2, 'строка меньше 2 символов'],
    required: true,
  },
  tags: {
    type: String,
    required: true,
    minlength: [2, 'строка меньше 2 символов'],
    trim: true
  }
})

const collectionName = 'notes'
const model = mongoose.model('Note', NoteSchema, collectionName)

module.exports = {model, collectionName}
