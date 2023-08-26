import { Types } from "mongoose";
import Job from "../model/Job.js";

export const getAllJobs = async (req, res, next) => {
  const currentPage = req.query.currentPage || 1;
  const perPage = 10;

  try {
    const jobCount = await Job.find().countDocuments();
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      jobs,
      jobCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
export const getOneJob = async (req, res, next) => {
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      const error = new Error("Could not find This Job!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      msg: "Found This Job",
      job,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const postNewJob = async (req, res, next) => {
  // TODO: Perform input validation and error handling here
  const { title, location, jobType, description, skills } = req.body;
  // 64e6271753c03b0c169d6463
  const companyID = new Types.ObjectId(req.userId);
  try {
    const newJob = new Job({
      title,
      company: companyID,
      location,
      jobType,
      description,
      skillsRequired: skills,
    });
    await newJob.save();
    return res.status(201).json({
      msg: "Job successfully Created...",
      job: newJob,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
