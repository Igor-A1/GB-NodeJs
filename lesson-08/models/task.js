const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId:
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
  createDate:
    {
      type: Date, 
      required: true
    },
  updateDate:
    Date,
  completeDate:
    Date,
  priority:
    {
      type: String,
      enum: ['low', 'normal', 'high'],
      required: true,
      lowercase: true
    },
  title:
    {
      type: String,
      required: true
    },
  text:
    String
})

const collectionName = 'tasks'

module.exports = mongoose.model('Task', taskSchema, collectionName)
