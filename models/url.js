var mongoose = require('mongoose')
var Schema = mongoose.Schema
var counter = require('./counter')

// create a schema for our links
var urlSchema = new Schema({
  _id: {type: Number, index: true},
  long_url: String,
  created_at: Date,
  hits: { type: Number, default: 0 }
})

urlSchema.pre('save', function (next) {
  var doc = this
  counter.findByIdAndUpdate({_id: 'url_count'}, { $inc: {seq: 1} }, function (error, counter) {
    if (error) {
      return next(error)
    }
    doc.created_at = new Date()
    doc._id = counter.seq
    next()
  })
})

var Url = mongoose.model('Url', urlSchema)

module.exports = Url
