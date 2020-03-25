//Hashing Alogoritm
const Sha256 = require('crypto-js/sha256');

//Framework
const express = require('express')

//Main DataBase
const Transaction = require('../models/transaction.model')
const MainBlockChain = require('../models/mainblockchain.model')

//Show
const ShowCustomer_Trans = require('../models/showcustomer_trans.model')
const Show_State = require('../models/show_state.model')
const Show_FPS = require('../models/show_fps.model')
const Show_Customer = require('../models/show_customer.model')
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

    //Transaction
    createGenesisBlock(){
        let newTransaction = new Transaction({
            index:0,
            timestamp:'01/01/2020',
            data:{
            cus_id :'0',
            shop_id:'0',
            rice:'0',
            wheet:'0',
            sugar:'0',
            rate_rice:'0',
            rate_wheet:'0',
            rate_sugar:'0',
            price_rice:'0',
            price_wheet:'0',
            price_sugar:'0'},
            previoushash:'0',
            hash:Sha256('0'+ '01/01/2020'+ '0'+ JSON.stringify({
                cus_id :'0',
                shop_id:'0',
                rice:'0',
                wheet:'0',
                sugar:'0',
                rate_rice:'0',
                rate_wheet:'0',
                rate_sugar:'0',
                price_rice:'0',
                price_wheet:'0',
                price_sugar:'0'})).toString(),
        });
        newTransaction.save(()=>{
            return newTransaction;
        })
        
    }

    //ShowCustomer_Trans
    createGenesisBlock1(){
        let newShowCustomer_Trans = new ShowCustomer_Trans({
            index:0,
            timestamp:'01/01/2020',
            data:{
            from:'0',
            to :'0',
            rice:'0',
            wheet:'0',
            sugar:'0'},
            previoushash:'0',
            hash:Sha256('0'+ '01/01/2020'+ '0'+ JSON.stringify({
                from:'0',
                to :'0',
                rice:'0',
                wheet:'0',
                sugar:'0'})).toString(),
        });
        newShowCustomer_Trans.save(()=>{
           
            return newShowCustomer_Trans;
        })
        
    }

    //Main BlockChain
    createGenesisBlock2(){
        let newMainBlockChain = new MainBlockChain({
            index:0,
            timestamp:'01/01/2020',
            data:{
            from:'0',
            to :'0',
            rice:'0',
            wheet:'0',
            sugar:'0'},
            previoushash:'0',
            hash:Sha256('0'+ '01/01/2020'+ '0'+ JSON.stringify({
                from:'0',
                to :'0',
                rice:'0',
                wheet:'0',
                sugar:'0'})).toString(),
        });
        newMainBlockChain.save(()=>{
           
            return newMainBlockChain;
        })
        
    }

    //Transaction
    async getLattestBlock(){
       let data = await Transaction.findOne({}, {}, { sort: { 'index' : -1 } });
       return data.hash;
    }

    //Show Customer_Trans
    async getLattestBlock1(){
        let data = await ShowCustomer_Trans.findOne({}, {}, { sort: { 'index' : -1 } });
        return data.hash;
    }

    //Main BlockChain
    async getLattestBlock2(){
        let data = await MainBlockChain.findOne({}, {}, { sort: { 'index' : -1 } });
        return data.hash;
    }

    //Transaction
    addBlock(newBlock){
         
        newBlock.mineBlock(this.difficulty);
         this.getLattestBlock().then((res)=>{
            newBlock.previoushash = res;
               let newTransaction = new Transaction(newBlock);
                newTransaction.save(async()=>{
                })
         })
    }

    //Show Customer_Trans
    addBlock1(newBlock){
        newBlock.mineBlock(this.difficulty);
         this.getLattestBlock1().then((res)=>{
            newBlock.previoushash = res;
               let newShowCustomer_Trans = new ShowCustomer_Trans(newBlock);
                newShowCustomer_Trans.save(async()=>{
                    console.log(newShowCustomer_Trans)
                    
                })
         })
    }

    //Main BlockChain
    addBlock2(newBlock){
        newBlock.mineBlock(this.difficulty);
         this.getLattestBlock2().then((res)=>{
            newBlock.previoushash = res;
               let newMainBlockChain = new MainBlockChain(newBlock);
                newMainBlockChain.save(async()=>{
                    console.log(newMainBlockChain)
                    
                })
         })
    }

    //Transaction
    async isChainValid(){

        let B = await Transaction.find({},(err,blocks)=>{
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

    //Show Customer_Trans
    async isChainValid1(){

        let B = await ShowFarmer_Trans.find({},(err,blocks)=>{
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

    //Main BlockChain
    async isChainValid2(){

        let B = await MainBlockChain.find({},(err,blocks)=>{
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

//First Page i.e When we click on Adminregistration Tab
router.get('/',function(req,res){
    sess = req.session
    console.log(sess)
    res.render('transaction',{aadharno:sess.aadharno})}
)

//When we are submitting the form
router.post('/',async (req,res)=>{

    //Date
    let date_ob = new Date();
    let date=( "Date: " + ("0"+date_ob.getDate()).slice(-2) + "/" + ("0"+(date_ob.getMonth()+1)).slice(-2) + "/" + (date_ob.getFullYear()) + " Time: " + (date_ob.getHours()) + "-" + (date_ob.getMinutes()) + "-" + (date_ob.getSeconds()) )
    //console.log(date)


    //Transaction
    let bc = await new BlockChain()
    //bc.createGenesisBlock();
    let idata = await Transaction.findOne({}, {}, { sort: { 'index' : -1 } });


    //Show Customer_Trans
    let bc1 = await new BlockChain()
    //bc1.createGenesisBlock1();
    let idata1 = await ShowCustomer_Trans.findOne({}, {}, { sort: { 'index' : -1 } });


    //Main BlockChain
    let bc2 = await new BlockChain()
    //bc2.createGenesisBlock2();
    let idata2 = await MainBlockChain.findOne({}, {}, { sort: { 'index' : -1 } });
   

    //Proof Of Work
    let Proof = await MainBlockChain.find({},(err,blocks)=>{
        for(let i=1; i<blocks.length;i++){
        }
    })

    stor=0
    stow=0
    stos=0

    sfromr=0
    sfromw=0
    sfroms=0

    for(let i=1;i<Proof.length;i++){
        const cb = Proof[i];

        if(req.body.shop_id==cb.data.to){
            stor=Number(stor)+Number(cb.data.rice);
            stow=Number(stow)+Number(cb.data.wheet);
            stos=Number(stos)+Number(cb.data.sugar);
        }

        if(req.body.shop_id==cb.data.from){
            sfromr=Number(sfromr)+Number(cb.data.rice);
            sfromw=Number(sfromw)+Number(cb.data.wheet);
            sfroms=Number(sfroms)+Number(cb.data.sugar);
        }

    }

    difr=stor-sfromr
    difw=stow-sfromw
    difs=stos-sfroms
    
    // console.log("ttttttt",stor,stow,stos)
    // console.log("ffffffff",sfromr,sfromw,sfroms)
    // console.log("dddddddd",difr,difw,difs)

    if(difr>=req.body.q1 && difw>=req.body.q2 && difs>=req.body.q3){

        //Show Database

        let Cengov = await Show_CenGov.find({},(err,blocks)=>{
            for(let i=1; i<blocks.length;i++){
            }
        })
    
        let S = await Show_State.find({},(err,blocks)=>{
            for(let i=1; i<blocks.length;i++){
            }
        })
    
        let F = await Show_FPS.find({},(err,blocks)=>{
            for(let i=1; i<blocks.length;i++){
            }
        })
    
        let Cus = await Show_Customer.find({},(err,blocks)=>{
            for(let i=1; i<blocks.length;i++){
            }
        })

        //Validation

        //Central Government To State Government
        cgtost=false

        for(let i=0;i<Cengov.length;i++){
            const cgcb = Cengov[i];

            if(cgcb.id==req.body.shop_id){
        
                for(let i=0;i<S.length;i++){
                    const currentBlock = S[i];
        
                    if(currentBlock.id==req.body.cus_id){
                        cgtost=true
                    
                    }
                }
            }
        }

        //State Government To FPS Owner
        sttofp=false

        for(let i=0;i<S.length;i++){
            const scb = S[i];

            if(scb.id==req.body.shop_id){
        
                for(let i=0;i<F.length;i++){
                    const currentBlock = F[i];
        
                    if(currentBlock.id==req.body.cus_id){
                        sttofp=true
                    
                    }
                }
            }
        }

        //FPS Owner To Customer
        fptocu=false

        for(let i=0;i<F.length;i++){
            const fcb = F[i];

            if(fcb.id==req.body.shop_id){
        
                for(let i=0;i<Cus.length;i++){
                    const currentBlock = Cus[i];
        
                    if(currentBlock.id==req.body.cus_id){
                        fptocu=true
                    
                    }
                }
            }
        }

        
        if(cgtost==true || sttofp==true || fptocu==true){

            //Transaction
            bc.addBlock(new Block(idata.index+1,date,
                {
                    cus_id:req.body.cus_id,
                    shop_id:req.body.shop_id,
                    rice:req.body.q1,
                    wheet:req.body.q2,
                    sugar:req.body.q3,
                    rate_rice:req.body.r1,
                    rate_wheet:req.body.r2,
                    rate_sugar:req.body.r3,
                    price_rice:req.body.p1,
                    price_wheet:req.body.p2,
                    price_sugar:req.body.p3,
                }
            ))
            

            //Show Customer_Trans
            bc1.addBlock1(new Block(idata1.index+1,date,
                {
                    from:req.body.shop_id,
                    to:req.body.cus_id,
                    rice:req.body.q1,
                    wheet:req.body.q2,
                    sugar:req.body.q3
                })
            )
        
            //Main BlockChain
            bc2.addBlock2(new Block(idata2.index+1,date,
                {
                    from:req.body.shop_id,
                    to:req.body.cus_id,
                    rice:req.body.q1,
                    wheet:req.body.q2,
                    sugar:req.body.q3
                })
            )
        
            
            
            //Central to State
            for(let i=0;i<Cengov.length;i++){
                const cgcb = Cengov[i];

                if(cgcb.id==req.body.shop_id){
            
                    for(let i=0;i<S.length;i++){
                        const currentBlock = S[i];
            
                        if(currentBlock.id==req.body.cus_id){
            
                            rs=Number(cgcb.rice)-Number(req.body.q1)
                            ws=Number(cgcb.wheet)-Number(req.body.q2)
                            ss=Number(cgcb.sugar)-Number(req.body.q2)
            
                            
                            let show_cengov = await Show_CenGov.findByIdAndUpdate((cgcb._id),{
                                rice:rs,
                                wheet:ws,
                                sugar:ss,
                            })
                            show_cengov.save()
            
                            rs=Number(currentBlock.rice)+ Number(req.body.q1)
                            ws=Number(currentBlock.wheet)+ Number(req.body.q2)
                            ss=Number(currentBlock.sugar)+Number(req.body.q3)
            
                            let show_state = await Show_State.findByIdAndUpdate((currentBlock._id),{
                                rice:rs,
                                wheet:ws,
                                sugar:ss,
                            })
                            show_state.save()
                        }
                    }
            
                }
            }
        
            //State to FPS
            for(let i=0;i<S.length;i++){
                const scb = S[i];
        
                if(scb.id==req.body.shop_id){
        
                    for(let j=0;j<F.length;j++){
                        const fcb= F[j];
            
                        if(fcb.id==req.body.cus_id){
        
                            rs=Number(scb.rice)-Number(req.body.q1)
                            ws=Number(scb.wheet)-Number(req.body.q2)
                            ss=Number(scb.sugar)-Number(req.body.q2)
            
                            
                            let show_state = await Show_State.findByIdAndUpdate((scb._id),{
                                rice:rs,
                                wheet:ws,
                                sugar:ss,
                            })
                            show_state.save()
            
                            rs=Number(fcb.rice)+ Number(req.body.q1)
                            ws=Number(fcb.wheet)+ Number(req.body.q2)
                            ss=Number(fcb.sugar)+Number(req.body.q3)
            
                            let show_fps = await Show_FPS.findByIdAndUpdate((fcb._id),{
                                rice:rs,
                                wheet:ws,
                                sugar:ss,
                            })
                            show_fps.save()
                                
                        }
                    }
            
                }
            }
        
            //FPS to Customer
            for(let i=0;i<F.length;i++){
                const fcb = F[i];
        
                if(fcb.id==req.body.shop_id){
        
                    for(let j=0;j<Cus.length;j++){
                        const cuscb= Cus[j];
            
                        if(cuscb.id==req.body.cus_id){
        
                            rs=Number(fcb.rice)-Number(req.body.q1)
                            ws=Number(fcb.wheet)-Number(req.body.q2)
                            ss=Number(fcb.sugar)-Number(req.body.q2)
            
                            
                            let show_fps = await Show_FPS.findByIdAndUpdate((fcb._id),{
                                rice:rs,
                                wheet:ws,
                                sugar:ss,
                            })
                            show_fps.save()
            
                            rs=Number(cuscb.rice)+ Number(req.body.q1)
                            ws=Number(cuscb.wheet)+ Number(req.body.q2)
                            ss=Number(cuscb.sugar)+Number(req.body.q3)
            
                            let show_cus = await Show_Customer.findByIdAndUpdate((cuscb._id),{
                                rice:rs,
                                wheet:ws,
                                sugar:ss,
                            })
                            show_cus.save()
                                
                        }
                    }
            
                }
            }

            sess=req.session;
            res.redirect('/admin/dashboard')

        }
        else{
            res.send("You Dont Have Permission To Do This Transaction");
        }
        
    }
    else{
        res.send("You Dont Have Enough Credits To Transfer");
    }
    
})

module.exports = router