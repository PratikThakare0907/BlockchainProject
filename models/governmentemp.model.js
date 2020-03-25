const mongoose = require('mongoose')

const Schema = mongoose.Schema

newSchema = new Schema({
    govdesg:String,
    govid:String,
})

module.exports = mongoose.model('Government_Emp',newSchema)