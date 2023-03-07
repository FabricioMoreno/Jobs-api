const moongose = require("mongoose")


const JobSchema = new moongose.Schema({
    company:{
        type:String,
        required:[true,"Please provide company name"],
        maxlength:50
    },
    position:{
        type:String,
        required:[true,"Please provide position"],
        maxlength:100
    },
    status:{
        type:String,
        enum:["interview","declined","pending"],
        defualt:"pending"
    },
    createdBy:{
        type:moongose.Types.ObjectId,
        ref:"User",
        required:[true,"Please provide user"],
        maxlength:50
    },
},{
    timestamps:true
})

module.exports = moongose.model("Job",JobSchema)