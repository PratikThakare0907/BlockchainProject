const mongoose = require('mongoose')

const Schema = mongoose.Schema

dataSchema = new Schema({
    fname:String,
    lname:String,
    sname:String,
    sid:String,
    mobileno:String,
    uid:String,
    designation:String,
    country:String,
    state:String,
    city:String,
    address:String,
    zip:String,
    gender:String,
    email:String,
    aadharno:String,
    password:String,

})

newSchema = new Schema({
   
    index:Number,
    timestamp:String,
    data:dataSchema,
    previoushash:String,
    hash:String,
})

module.exports = mongoose.model('Admin',newSchema)