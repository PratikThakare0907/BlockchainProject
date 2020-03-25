const mongoose = require('mongoose')

const Schema = mongoose.Schema

newSchema = new Schema({
    id:String,
    rice:String,
    wheet:String,
    sugar:String,
})

module.exports = mongoose.model('Show_CenGov',newSchema)