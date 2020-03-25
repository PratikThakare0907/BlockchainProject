//Framework
const express = require('express')

//Main DataBase
const GovEmp = require('../models/governmentemp.model')

//Initilizing Router
const router = express.Router()

//First Page i.e When we click on Adminregistration Tab
router.get('/',(req,res)=>{
    res.render('government_emp');
})

//When we are submitting the form
router.post('/',async(req,res)=>{ 

    customerdata = await GovEmp.find({});

        gov = new GovEmp({
            govdesg:req.body.govdesg,
            govid:req.body.govid,

        }) 
   
    gov.save(()=>{
        res.redirect('/')
    })

})


module.exports = router