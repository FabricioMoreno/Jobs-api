const User = require("../models/User")
const {BadRequestError,  UnauthenticatedError} = require("../errors/index")
const jwt = require("jsonwebtoken")


const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new UnauthenticatedError("No authorization provided")
    }

    const token = authHeader.split(" ")[1]
    try{
        const decoded = jwt.verify(token,process.env.JWT_PASSWORD)

        //attach the user to the job routes
        req.user = {
            userId:decoded.userId,
            name: decoded.name
        }

        next()

    }catch(err){
        console.log("her")
        throw new UnauthenticatedError("Invalid authorization")
    }

}

module.exports = authMiddleware