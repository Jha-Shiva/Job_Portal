import express from 'express';
import userAuth from '../middlewares/authMiddleware.js';
import { createJobController, deleteJobController, getAllJobsController, jobsStatsController, updateJobController } from '../controllers/jobsController.js';

const router = express.Router();

//routes
//CREATE || POST
router.post('/create-job', userAuth, createJobController);

//GET JOB || GET
router.get('/get-job', userAuth, getAllJobsController)

//UPDATE JOB || PUT || PATCH
router.patch('/update-job/:id', userAuth, updateJobController)

//DELETE JOB || DELETE
router.delete('/delete-job/:id',userAuth, deleteJobController )

// JOB STAT FILTER || GET
router.get('/job-stats',userAuth, jobsStatsController )

export default router;