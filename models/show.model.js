const mongoose = require('mongoose');

const Schema = mongoose.Schema;

newSchema = new Schema({
    id:String,
    r:Number,
    w:Number,
    s:Number,
    store:String
})

module.exports = mongoose.model('Show',newSchema)