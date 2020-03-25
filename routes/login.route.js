//Framework
const express = require('express')

//To Store Password in Encrypted Form
const bcrypt = require('bcrypt')

//Main DataBase
const customer = require('../models/customer.model')
const admin = require('../models/adminregistration.model')

//Initilizing Router
const router = express.Router()


router.get('/:type',(req,res)=>{
    res.render('login',{type:req.params.type})
})

    router.post('/:type',async (req,res)=>{
        sess=req.session;
        sess.aadharno = req.body.aadharno
        sess.type = req.params.type    
        
        if(req.params.type == 'customer'){
            
            customerdata = await customer.find({});
            
            for(var i=0;i<customerdata.length;i++){
                if(customerdata[i].data.aadharno == req.body.aadharno){
                    rest = await bcrypt.compare(req.body.password, customerdata[i].data.password);
                }
                
            }
            if(rest == true){res.redirect('/')}
            
        }else{
            admindata = await admin.find({});
            console.log(admindata)
            for(var i=0;i<admindata.length;i++){
                if(admindata[i].data.aadharno == req.body.aadharno){
                    rest = await bcrypt.compare(req.body.password, admindata[i].data.password);
                }
                
            }
            if(rest == true){res.redirect('/')}
            else{res.render('login',{'message':'notok'})}
            
        }
        
        
    })
module.exports = router
