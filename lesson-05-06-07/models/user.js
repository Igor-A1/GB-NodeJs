const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  login: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    trim: true,
    minlength: [4, 'строка меньше 4 символов'],
    uniqueCaseInsensitive: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [4, 'строка меньше 4 символов']
  },
  fullname: {
    type: String,
    trim: true,
    default: 'anonymous'
  },  
  email: {
    type: String,
    trim: true,
    unique: true,
    dropDups: true,
    uniqueCaseInsensitive: true
  },
})

UserSchema.methods.genHash = password => bcrypt.hashSync(password, 7)
UserSchema.methods.isValidPassword = function(password) { // "this" used !
  return bcrypt.compareSync(password, this.password)
}

const guest = {
  _id: '5e4432c3e996712354a0444a',
  login: 'guest',
  password: bcrypt.hashSync('', 7), 
  fullname: 'Гость'
}

const root = {
  _id: '5e4432c3e996712354a04449',
  login: 'root',
  password: bcrypt.hashSync('Ro0tPa55W0Rd', 7), 
  fullname: 'Администратор'
}

UserSchema.plugin(uniqueValidator, {message: 'значение "{VALUE}" уже использовано'})

const collectionName = 'users'
const model = mongoose.model('User', UserSchema, collectionName)

module.exports = {model, guest, root, collectionName}

