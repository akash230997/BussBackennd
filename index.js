
const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Seats = require('./Seats');

app.use(cors())
app.use(express.json())

async function run(){
    try{
        await mongoose.connect("mongodb+srv://Akash:Akash12meena@cluster0.aikntzv.mongodb.net/databook");
        console.log('connected');
    }catch(err){
        console.log(err);
    }
}
run();

app.get('/',(req,res)=>{
    res.send("Welcome to homepage")
})

app.post('/signup',async (req,res)=>{

    const {name,email,password} = req.body
    console.log(name,email,password);
    try{
        const oldUser = await User.find({email})
        if(oldUser.length!==0){
            console.log(oldUser);
            return res.send({error:"User Already Exists"})
        }
        const hashPass = await bcrypt.hash(password,7)
        const user = new User({name,email,password:hashPass})

        const result = await User.insertMany(user);
        res.send({status:"ok"})

        console.log('registered');
        console.log(result);
    }
    catch(err){
        res.send({status:"error"})
        console.log(err);;
    }
})


const SECRET_KEY = 'sdf34jsd9784hkl'
app.post('/login',async (req,res)=>{

    const {email,password} = req.body
    console.log(email,password);
    try{
        const user = await User.findOne({email})
    if(!user){
        return res.json({error:"User not found"})
    }
    if(bcrypt.compare(password,user.password)){
        const token = jwt.sign({},SECRET_KEY);
        console.log(user,"hello");
        if(res.status(201)){
            return res.json({status:"ok",token:token,data:user})
        }else{
            return res.json({error: "error"})
        }
    }
    res.json({ status:"error",error:"Invalid Password"})
    }
    catch(err){
        res.send({status:"error"})
        console.log(err);
    }
})

app.post('/seat',async (req,res)=>{
    const {seatRes} = req.body;
    console.log(seatRes);

    const seat = new Seats({reservedSeat : seatRes});
    const result = await Seats.updateMany(
        {
            _id:"63af2caa3e801fd2594e3475"
        },
        {
            $set : {
                reservedSeat : seatRes
            }
        }
    )   
    console.log(result);
})

app.get('/seat',async (req,res)=>{
    try{
        const seats = await Seats.findOne({_id:"63af2caa3e801fd2594e3475"})
        res.send(seats.reservedSeat)
    }
    catch(err){
        console.log(err);
    }
})


app.listen(1000,()=>{
    console.log('server started');
})