const mongoose=require("mongoose")

const userschema= mongoose.Schema({
     username:{type:String,requried:true},
     Email:{type:String,requried:true},
     password:{type:String,requried:true},
     mobile:{type:Number,requried:true},
     role:{type:String,enum:["admin"]},
     otp:{type:Number},
     otpTimeStamp:{type:Number},
     isOtpverified:{type:Boolean,default:false},
    
     
},
{
     timestamps:true,
     versionKey:false
 })
const User=mongoose.model('User',userschema)

module.exports =User