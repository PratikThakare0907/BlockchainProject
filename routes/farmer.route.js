//Hashing Alogoritm
const Sha256 = require('crypto-js/sha256');

//Framework
const express = require('express')

//To Store Password in Encrypted Form
const bcrypt = require('bcrypt');

//Main DataBase
const Farmer = require('../models/farmer.model')

//Initilizing Router
const router = express.Router()

//BlockChain

class Block{
    constructor(index, timestamp, data, previoushash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.nounce = 0;
        this.hash = this.CalculateHash();
        
    }

    CalculateHash(){
        return Sha256(this.index+ this.timestamp+this.nounce+ this.previoushash+ JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nounce++;
            this.hash=this.CalculateHash()
        }
    }

}

class BlockChain{
    
    constructor(){
        this.difficulty=2;
        
    }

    createGenesisBlock(){
        let newFarmer = new Farmer({
            index:0,
            timestamp:'01/01/2020',
            data:{
                fname:'0',
                lname:'0',
                mobileno:'0',
                country:'0',
                state:'0',
                city:'0',
                address:'0',
                zip:'0',
                gender:'0',
                email:'0',
                aadharno:'0',
                password:'0'},
            previoushash:'0',
            hash:Sha256('0'+ '01/01/2020'+ '0'+ JSON.stringify({
                fname:'0',
                lname:'0',
                mobileno:'0',
                country:'0',
                state:'0',
                city:'0',
                address:'0',
                zip:'0',
                gender:'0',
                email:'0',
                aadharno:'0',
                password:'0'})).toString(),
        });
        newFarmer.save(()=>{
            return newFarmer;
        })
        
    }

    async getLattestBlock(){
       let data = await Farmer.findOne({}, {}, { sort: { 'index' : -1 } });
       return data.hash;
    }

     addBlock(newBlock){
         
        newBlock.mineBlock(this.difficulty);
         this.getLattestBlock().then((res)=>{
            newBlock.previoushash = res;
               let newFarmer = new Farmer(newBlock);
                newFarmer.save(()=>{
                    console.log(newFarmer)
                    
                })
         })
    }


    async isChainValid(){

        let B = await Farmer.find({},(err,blocks)=>{
            for(let i=1; i<blocks.length;i++){
            }
        })

        for(let i=1;i<B.length;i++){

            const currentBlock = B[i];
            const previousBlock = B[i-1];

            if(currentBlock.previoushash !== previousBlock.hash){
                return false
            }
           
        }
        return true
        
    }
}

let user = 
{
    _id:'',
    fname:'',
    lname:'',
    mobileno:'',
    country:'',
    state:'',
    city:'',
    address:'',
    zip:'',
    gender:'',
    email:'',
    aadharno:'',
    password:''
}

//First Page i.e When we click on Adminregistration Tab
router.get('/',function(req,res){
    Farmer.find({},(err,users)=>{
        console.log(user.fname)
        res.render('farmer',{users:users,user:user})
    }) 
})

//When we are submitting the form
router.post('/',async (req,res)=>{

    // BC
    let bc = await new BlockChain()
    //bc.createGenesisBlock();
    
    //Index
    let idata = await Farmer.findOne({}, {}, { sort: { 'index' : -1 } });

    //Date
    let date_ob = new Date();
    let date=( "Date: " + ("0"+date_ob.getDate()).slice(-2) + "/" + ("0"+(date_ob.getMonth()+1)).slice(-2) + "/" + (date_ob.getFullYear()) + " Time: " + (date_ob.getHours()) + "-" + (date_ob.getMinutes()) + "-" + (date_ob.getSeconds()) )
    //console.log(date)

    //BC
    let valid = await bc.isChainValid()

    //Main
    let mypass = await bcrypt.hash(req.body.password, 10);

    customerdata = await Farmer.find({});
    for(var i=0;i<customerdata.length;i++){
        if(customerdata[i].data.aadharno == req.body.aadharno){
            myaadhar=null
        }
        else{
            myaadhar=0
        }
        
    }
    
    //BC
    if(valid == true){

        if(myaadhar!=null){

            bc.addBlock(new Block(idata.index+1,date,
                {
                    fname:req.body.fname,
                    lname:req.body.lname,
                    mobileno:req.body.mobileno,
                    country:req.body.country,
                    state:req.body.state,
                    city:req.body.city,
                    address:req.body.address,
                    zip:req.body.zip,
                    gender:req.body.gender,
                    email:req.body.email,
                    aadharno:req.body.aadharno,
                    password:mypass
                }
            ))
        }
        else{
            res.send("Aadhar No Already Exits");
        }
        
    }
    else{
        res.send("Blockchain Is Tampered");
    }
    
    res.redirect('/');
   
})




module.exports = router