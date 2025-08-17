import jobModel from "../models/jobModel.js";
import mongoose from "mongoose";
import moment from "moment";

//=======Create Job========
export const createJobController = async(req, res, next)=>{
    const {company , position} = req.body
    if (!company || !position){
        return next('Please Provide All Fields')
    }
    req.body.createdBy = req.user.userId;
    const job = await jobModel.create(req.body);
    res.status(201).json({ job });
};

//=======Get Job========
export const getAllJobsController = async(req, res, next)=>{
    const {status, workType, search, sort} = req.query;
    //conditions for searching Filters
    const queryObject = {
        createdBy: req.user.userId
    }
    //logic filters
    //status filter logic
    if(status && status !== 'all'){
        queryObject.status = status;
    };
    //workType filter logic
    if(workType && workType !== 'all'){
        queryObject.workType = workType;
    };
    //search job position
    if(search){
        queryObject.position = { $regex:search, $options:'i' }
    }
    let queryResult = jobModel.find(queryObject);

    //sorting
    //latest jobs
    if(sort === 'latest'){
        queryResult = queryResult.sort('-createdAt');
    };
    //oldest jobs
    if(sort === 'oldest'){
        queryResult= queryResult.sort('createdAt');
    };
    //sort on a-z in position place
    if(sort === 'a-z'){
        queryResult = queryResult.sort('position');
    };
    //sort on the basis of z-a in position place
    if(sort === 'z-a'){
        queryResult = queryResult.sort('-position')
    };
    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit);
    //job count
    const totalJobs = await jobModel.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs/limit);

    const jobs = await queryResult;

    // //get all jobs
    // const jobs = await jobModel.find({createdBy: req.user.userId})
    res.status(200).json({
        totalJobs,
        jobs,
        numOfPage
    });
};

//======UPDATE JOB========
export const updateJobController = async(req, res, next)=>{
    const {id} = req.params
    const {company, position} = req.body
    //validation
    if (!company || !position){
        return next('Pleas Provide All Fields')
    }
    //find Jobs
    const job = await jobModel.findOne({_id: id})
    //validation
    if(!job){
        return next(`no job found with this id ${id}`)
    }
    if(!(req.user.userId === job.createdBy.toString())){
        next('you are not Authorized to update this job')
        return
    }

    const updateJob  = await jobModel.findOneAndUpdate({_id:id}, req.body , {
        new: true,
        runValidators: true
    });
    //res send
    res.status(200).json({ updateJob });
};

//======= DELETE JOB=========
export const deleteJobController = async (req, res, next)=>{
    const {id} = req.params
    //find job
    const job = await jobModel.findOne({_id: id})
    if(!job){
        return next(`no job found with this id ${id}`)
    }
    if(!(req.user.userId === job.createdBy.toString())){
        return next('You are not Authorized to delete this Job')
        return
    }

    await job.deleteOne()
    res.status(200).json({message: 'Success Job Deleted!'})
};

//=========== JOBS STATS & FILTER ==============
export const jobsStatsController = async (req, res)=>{
    const stats = await jobModel.aggregate([
        //search by user job
        {
            $match:{
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            },
        },
        {
            $group: {
                _id:'$status' , count:{$sum:1}
            }
        },
        // To show 2 or more stats together
        // {
        //     $group:{
        //         _id:{ workType: '$workType', status: '$status'}, count: {$sum:1}
        //     }
        // },
    ]);
    //default stats
    const defaultStats = {
        pending: 0,
        reject: 0,
        interview: 0
    };

    // monthly or yearly stats
    let monthlyApplications = await jobModel.aggregate([
        {
            $match:{
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group:{
                _id:{
                    year:{$year:'$createdAt'},
                    month: {$month: '$createdAt'}
                },
                count:{
                    $sum:1
                }
            }
        }
    ]);
    // to perfectly format date using moment library
    monthlyApplications = monthlyApplications.map((item)=>{
        const {_id:{year, month}, count} = item;
        const date = moment().month(month - 1).year(year).format('MMM Y');
        return { date, count }
    }).reverse()

    res.status(200).json({ totalJobs: stats.length, stats:stats.length>0 ? stats : defaultStats, monthlyApplications })

    //it is another way to show stats
    // // default stats
    // const defaultStats = {
    //     pending: 0,
    //     reject: 0,
    //     interview: 0
    // }
    // //to populate default stats with actual values from stats
    // stats.forEach((item)=>{
    //     defaultStats[item._id] = item.count
    // })
    // res.status(200).json({ totalJobs: stats.length,  defaultStats })
};