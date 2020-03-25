const mongoose =require('mongoose')

const Schema = mongoose.Schema

dataSchema = new Schema({
    shop_id :String,
    farmer_id:String,
    rice:String,
    wheet:String,
    sugar:String,
    rate_rice:String,
    rate_wheet:String,
    rate_sugar:String,
    price_rice:String,
    price_wheet:String,
    price_sugar:String,
})

newSchema = new Schema({
   
    index:Number,
    timestamp:String,
    data:dataSchema,
    previoushash:String,
    hash:String,
})

module.exports = mongoose.model('Farmer_Tran',newSchema)