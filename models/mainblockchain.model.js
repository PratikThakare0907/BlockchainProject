const mongoose = require('mongoose')

const Schema = mongoose.Schema

dataSchema = new Schema({
    from:String,
    to:String,
    rice:String,
    wheet:String,
    sugar:String,
})

newSchema = new Schema({
   
    index:Number,
    timestamp:String,
    data:dataSchema,
    previoushash:String,
    hash:String,
})

module.exports = mongoose.model('MainBlockChain',newSchema)