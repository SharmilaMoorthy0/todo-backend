const mongoose=require("mongoose")

const todoschema= mongoose.Schema({
     Task:{type:String,requried:true},
     isCompleted:{type:Boolean,default:false},
     createdby:{type:mongoose.Types.ObjectId}
     
},{
     timestamps:true,
     versionKey:false
 }
)
const todo=mongoose.model('todo',todoschema)

module.exports =todo