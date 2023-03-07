const moongose = require("mongoose")
const bycript = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new moongose.Schema({
    name:{
        type:String,
        required:[true,"Please provide name"],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,"Please provide email"],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please provide valid email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please provide password"],
        minlength:3,
    },
})


UserSchema.pre("save", async function(next){
    const salt = await bycript.genSalt(10)
    this.password = await bycript.hash(this.password,salt)

    next()

})

UserSchema.methods.createJWT = function(){
    const token=jwt.sign({
        userId:this._id,
        name:this.name
    },process.env.JWT_PASSWORD,{expiresIn:process.env.JWT_EXPIRED_TIME})

    return token
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bycript.compare(candidatePassword,this.password)
    console.log(isMatch)
    
    return isMatch
}

module.exports = moongose.model("User",UserSchema)