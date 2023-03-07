const Job = require("../models/Job")
const {StatusCodes} = require("http-status-codes")
const {BadRequestError,NotFoundError} = require("../errors/index")


const getAllJobs = async(req,res)=>{
    const userId = req.user.userId
    const allJobs = await Job.find({createdBy:userId}).sort("createdAt")
    res.status(StatusCodes.OK).json({allJobs,count:allJobs.length})
}

const getJob = async(req,res)=>{
    const {user:{userId},params:{id:jobId}} = req
    const job = await Job.findOne({
        _id:jobId,
        createdBy:userId
    })

    if(!job){
        throw NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const createJob = async(req,res)=>{
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req,res)=>{
    const {body:{company,position},user:{userId},params:{id:jobId}} = req

    if(!company || !position){
        throw new BadRequestError("Company and positon must be provided")
    }
    const job = await Job.findByIdAndUpdate({
        _id: jobId,
        createdBy: userId
    },req.body,{new:true,runValidators:true})

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async(req,res)=>{
    const {user:{userId},params:{id: jobId}} =req
    const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy:userId
    })
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}