//Hashing Alogoritm
const Sha256 = require('crypto-js/sha256');

//Framework
const express = require('express')

//To Store Password in Encrypted Form
const bcrypt = require('bcrypt');

//Main DataBase
const Admin = require('../models/adminregistration.model')
const Gov = require('../models/governmentemp.model')

//Show
const Show_State = require('../models/show_state.model')
const Show_FPS = require('../models/show_fps.model')
const Show_CenGov = require('../models/show_cengov.model')

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
        let newAdmin = new Admin({
            index:0,
            timestamp:'01/01/2020',
            data:{
                fname:'0',
                lname:'0',
                sname:'0',
                sid:'0',
                mobileno:'0',
                uid:'0',
                designation:'0',
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
                sname:'0',
                sid:'0',
                mobileno:'0',
                uid:'0',
                designation:'0',
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
        newAdmin.save(()=>{
            return newAdmin;
        })
        
    }

    async getLattestBlock(){
       let data = await Admin.findOne({}, {}, { sort: { 'index' : -1 } });
       return data.hash;
    }

     addBlock(newBlock){
         
        newBlock.mineBlock(this.difficulty);
         this.getLattestBlock().then((res)=>{
            newBlock.previoushash = res;
               let newAdmin = new Admin(newBlock);
                newAdmin.save(()=>{
                    console.log(newAdmin)
                    
                })
         })
    }


    async isChainValid(){

        let B = await Admin.find({},(err,blocks)=>{
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
    sname:'',
    sid:'',
    mobileno:'',
    uid:'',
    designation:'',
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
    Admin.find({},(err,users)=>{
        console.log(user.fname)
        res.render('adminregistration',{users:users,user:user})
    }) 
})

//When we are submitting the form
router.post('/',async (req,res)=>{

    // BC
    let bc = await new BlockChain()
    //bc.createGenesisBlock();

    //Index
    let idata = await Admin.findOne({}, {}, { sort: { 'index' : -1 } });

    //Date
    let date_ob = new Date();
    let date=( "Date: " + ("0"+date_ob.getDate()).slice(-2) + "/" + ("0"+(date_ob.getMonth()+1)).slice(-2) + "/" + (date_ob.getFullYear()) + " Time: " + (date_ob.getHours()) + "-" + (date_ob.getMinutes()) + "-" + (date_ob.getSeconds()) )
    //console.log(date)
    
    //Main
    let mypass = await bcrypt.hash(req.body.password, 10);

    customerdata = await Admin.find({});

    for(var i=0;i<customerdata.length;i++){
        if(customerdata[i].data.aadharno == req.body.aadharno){
            myaadhar=null
        }
        else{
            myaadhar=0
        }
        
    }

    let mygov = await Gov.findOne({'govdesg':req.body.designation,'govid':req.body.uid})

    //BC
    let valid = await bc.isChainValid()
    
    //BC
    if(mygov !=null){

        if(valid == true){

            if(myaadhar!=null){

                bc.addBlock(new Block(idata.index+1,date,
                    {
                        fname:req.body.fname,
                        lname:req.body.lname,
                        sname:req.body.sname,
                        sid:req.body.sid,
                        mobileno:req.body.mobileno,
                        uid:req.body.uid,
                        designation:req.body.designation,
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
                
                //Show Central Government
                if(req.body.designation == "Central_Government"){
                    let newCenGov = new Show_CenGov({
                        id:req.body.aadharno,
                        rice:0,
                        wheet:0,
                        sugar:0
                    });
                    newCenGov.save(()=>{
                        return newCenGov;
                    })
                }
                
                //Show State Government
                if(req.body.designation == "State_Government"){
                    let newstate = new Show_State({
                        id:req.body.aadharno,
                        rice:0,
                        wheet:0,
                        sugar:0
                    });
                    newstate.save(()=>{
                        return newstate;
                    })
                }
                
                //Show FPS Owner
                if(req.body.designation == "FPS_Owner"){
                    let newfps = new Show_FPS({
                        id:req.body.aadharno,
                        rice:0,
                        wheet:0,
                        sugar:0
                    });
                    newfps.save(()=>{
                        return newfps;
                    })
                }

            }
            else{
                res.send("Aadhar No Already Exits");
            }
        }
        else{
            res.send("Blockchain Is Tampered");
        }

    }
    else{
        res.send("Entered Government Id Does Not Match With DataBase");
    }

    res.redirect('/login/admin')

})


module.exports = router