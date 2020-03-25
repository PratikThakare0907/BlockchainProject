//Hashing Alogoritm
const Sha256 = require('crypto-js/sha256');

//Framework
const express = require('express')

//Main DataBase
const FarmerTrans = require('../models/farmertrans.model')
const MainBlockChain = require('../models/mainblockchain.model')

//Show
const ShowFarmer_Trans = require('../models/showfarmer_trans.model')
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
        let newFarmerTrans = new FarmerTrans({
            index:0,
            timestamp:'01/01/2020',
            data:{
            shop_id:'0',
            farmer_id :'0',
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
                shop_id:'0',
                farmer_id :'0',
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
        newFarmerTrans.save(()=>{
           
            return newFarmerTrans;
        })
        
    }

    //Show Farmer Trans
    createGenesisBlock1(){
        let newShowFarmer_Trans = new ShowFarmer_Trans({
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
        newShowFarmer_Trans.save(()=>{
           
            return newShowFarmer_Trans;
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

    //Farmer Trans
    async getLattestBlock(){
       let data = await FarmerTrans.findOne({}, {}, { sort: { 'index' : -1 } });
       return data.hash;
    }

    //Show Farmer Trans
    async getLattestBlock1(){
        let data = await ShowFarmer_Trans.findOne({}, {}, { sort: { 'index' : -1 } });
        return data.hash;
    }

    //Main BlockChain
    async getLattestBlock2(){
        let data = await MainBlockChain.findOne({}, {}, { sort: { 'index' : -1 } });
        return data.hash;
    }

    //Farmer Trans
    addBlock(newBlock){
        newBlock.mineBlock(this.difficulty);
         this.getLattestBlock().then((res)=>{
            newBlock.previoushash = res;
               let newFarmerTrans = new FarmerTrans(newBlock);
                newFarmerTrans.save(async()=>{
                })
         })
    }

    //Show Farmer Trans
    addBlock1(newBlock){
        newBlock.mineBlock(this.difficulty);
         this.getLattestBlock1().then((res)=>{
            newBlock.previoushash = res;
               let newShowFarmer_Trans = new ShowFarmer_Trans(newBlock);
                newShowFarmer_Trans.save(async()=>{
                    console.log(newShowFarmer_Trans)
                    
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

    //Farmer Trans
    async isChainValid(){

        let B = await FarmerTrans.find({},(err,blocks)=>{
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

    //Show Farmer Trans
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
    res.render('farmer_trans',{aadharno:sess.aadharno})}
)

//When we are submitting the form
router.post('/',async (req,res)=>{

    //Date
    let date_ob = new Date();
    let date=( "Date: " + ("0"+date_ob.getDate()).slice(-2) + "/" + ("0"+(date_ob.getMonth()+1)).slice(-2) + "/" + (date_ob.getFullYear()) + " Time: " + (date_ob.getHours()) + "-" + (date_ob.getMinutes()) + "-" + (date_ob.getSeconds()) )
    //console.log(date)

    //Farmer Trans
    let bc = await new BlockChain()
    let idata = await FarmerTrans.findOne({}, {}, { sort: { 'index' : -1 } });

    //bc.createGenesisBlock();
    bc.addBlock(new Block(idata.index+1,date,
        {
            shop_id:req.body.shop_id,
            farmer_id :req.body.farmer_id,
            rice:req.body.q1,
            wheet:req.body.q2,
            sugar:req.body.q3,
            rate_rice:req.body.r1,
            rate_wheet:req.body.r2,
            rate_sugar:req.body.r3,
            price_rice:req.body.p1,
            price_wheet:req.body.p2,
            price_sugar:req.body.p3,
        }))

    //Show Farmer Trans
    let bc1 = await new BlockChain()
    let idata1 = await ShowFarmer_Trans.findOne({}, {}, { sort: { 'index' : -1 } });

    //bc1.createGenesisBlock1();
    bc1.addBlock1(new Block(idata1.index+1,date,
        {
            from:req.body.farmer_id,
            to:req.body.shop_id,
            rice:req.body.q1,
            wheet:req.body.q2,
            sugar:req.body.q3
        })
    )

    //Main BlockChain
    let bc2 = await new BlockChain()
    let idata2 = await MainBlockChain.findOne({}, {}, { sort: { 'index' : -1 } });

    //bc2.createGenesisBlock2();
    bc2.addBlock2(new Block(idata2.index+1,date,
        {
            from:req.body.farmer_id,
            to:req.body.shop_id,
            rice:req.body.q1,
            wheet:req.body.q2,
            sugar:req.body.q3
        })
    )
    

    // Farmer to Central (Show CenGov)

    let C = await Show_CenGov.find({},(err,blocks)=>{
        for(let i=1; i<blocks.length;i++){
        }
    })

    for(let i=0;i<C.length;i++){
        const cgcb = C[i];

        if(cgcb.id==req.body.shop_id){


            rs=Number(cgcb.rice)+ Number(req.body.q1)
            ws=Number(cgcb.wheet)+ Number(req.body.q2)
            ss=Number(cgcb.sugar)+Number(req.body.q3)
    
            let Show_cengov = await Show_CenGov.findByIdAndUpdate((cgcb._id),{
                rice:rs,
                wheet:ws,
                sugar:ss,
            })
            Show_cengov.save()
        }
    }
    
    sess=req.session;
    res.redirect('/')
})




module.exports = router