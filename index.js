//Framework
const express = require("express");

//DataBase
const mongoose= require('mongoose')

//To Take Data From Pug File
const bodyParser = require('body-parser')

const path = require('path')

const cors =require('cors');

//Main DataBase
const Customer =require('./models/customer.model')
const Transaction = require('./models/transaction.model')
const Farmer = require('./models/farmer.model')

//Show
const Show = require('./models/show.model');
const Show_CenGov = require('./models/show_cengov.model');
const Show_State = require('./models/show_state.model');
const Show_FPS = require('./models/show_fps.model');
const Show_Customer = require('./models/show_customer.model');
const MainBlockChain = require('./models/mainblockchain.model')


//Work

//creating a app file to run are work
const app = express();

//session
var session = require('express-session')
app.use(session({ secret: '619619key', cookie: { maxAge: 60000 }}))

//BodyParser
app.use(bodyParser.urlencoded({extended:true}))

//DataBase Connectivity
mongoose.connect('mongodb+srv://ankitchopkar:ankitchopkar@cluster0-xblvy.mongodb.net/test?retryWrites=true&w=majority',{ useUnifiedTopology: true,useNewUrlParser: true })

//
// app.use(express.static('public'))
app.use(cors());

//
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

//
app.use(express.json());
app.set('view engine','pug');

//When we are getting response from frontend i.e when we are submitting any forms
app.use('/registration',require('./routes/customer.route'))

app.use('/login',require('./routes/login.route'))

app.use('/farmer',require('./routes/farmer.route'))

app.use('/transaction',require('./routes/transaction.route'))

app.use('/farmer_trans',require('./routes/farmer_trans.route'))

app.use('/adminregistration',require('./routes/adminregistration.route'))

app.use('/government_emp',require('./routes/governmentemp.route'))

//BlockChain Transcation
app.get('/blockchain_transcation',(req,res)=>{
   
    MainBlockChain.find({},(err,transactions)=>{
        res.render('blockchain_transcation',{transactions:transactions})  
    })  
})

//Dashboard
app.get('/admin/dashboard',(req,res)=>{
    sess = req.session
    Customer.find({},(err,customers)=>{
        res.render('dashboard-admin',{customers:customers,'aadharno':sess.aadharno,'type':sess.type})
    })
    
})
app.get('/admin/dashboard/:aadharno',(req,res)=>{
    sess = req.session
   
    Transaction.find({},(err,transactions)=>{
        res.render('dashboard-trans',{transactions:transactions,aadharno:req.params.aadharno,'type':sess.type})  
    })  
})

//Session (creating) => When we are login in then sending aadharno
app.get('/',(req,res)=>{
    sess=req.session;
    if(sess.aadharno == null){
        res.render('index',{'aadharno':null,'type':sess.type});
    }else{
        res.render('index',{'aadharno':sess.aadharno,'type':sess.type});
    }
    
})

//Session (exiting) => When we are logout
app.get('/logout',(req,res)=>{
    sess=req.session
    sess.aadharno = null
    res.redirect('/')
})

//Sending data to transaction page
app.get('/getusers/:aadharno',async (req,res)=>{
    users = await Customer.find({});
    for(var i=0;i<users.length;i++){
        if(users[i].data.aadharno == req.params.aadharno){
            return res.json(users[i])
        }
    }
    
})



//Sending data to farmer transaction page
app.get('/getfarmer/:aadharno',async (req,res)=>{
    users = await Farmer.find({});
    for(var i=0;i<users.length;i++){
        if(users[i].data.aadharno == req.params.aadharno){
            return res.json(users[i])
        }
    }
    
})

//Sending data to transaction page
app.get('/check_storage', async(req,res)=>{

    Show.findById('5e5e0fb01a13f126a9405909',(err,result)=>{
        if(err) throw err;
        strr = {rice:result.r,sugar:result.w,wheat:result.s}
        res.json(strr)
    })
})

//Sending Data

//Central Government

app.get('/check_storage_cg',(req,res)=>{
    Show_CenGov.find({},(err,cg)=>{
        res.json({transactions_cg:cg})  
    })  
})

//Port No on which we run our website locally
const PORT = process.env.PORT || 8080

//To run the site
app.listen(PORT)