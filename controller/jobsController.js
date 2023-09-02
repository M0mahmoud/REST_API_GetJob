import { validationResult } from "express-validator";
import { Types } from "mongoose";
import Job from "../model/Job.js";

export const getAllJobs = async (req, res, next) => {
  const pageNumber = req.params.page;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let peerPage = 10;
  const skipAmount = (pageNumber - 1) * peerPage;

  try {
    const jobCount = await Job.find().countDocuments();
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(peerPage);

    const isNext = jobCount > skipAmount + jobs.length;

    res.status(200).json({
      jobs,
      isNext,
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

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
  const { title, location, jobType, description, skills } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
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

export const updateJob = async (req, res, next) => {
  const jobId = req.params.jobId;
  const { title, location, jobType, description, skillsRequired } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const job = await Job.findById(jobId);

    // .populate("company");

    if (!job) {
      const error = new Error("Could Not Find This Job...!");
      error.statusCode = 404;
      throw error;
    }
    //TODO:
    // if (String(job.._id) !== req.userId) {
    //   const error = new Error("Not Authorized");
    //   error.statusCode = 404;
    //   throw error;
    // }

    job.title = title;
    job.location = location;
    job.jobType = jobType;
    job.description = description;
    job.skillsRequired = skillsRequired;

    await job.save();
    res.status(200).json({ msg: "Job Update Scessfully", job });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  const jobId = req.params.jobId;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      const error = new Error("Could Not Find This Job!");
      error.statusCode = 404;
      throw error;
    }
    // TODO: DELETE From User Job Application
    await Job.findByIdAndDelete(jobId);
    return res.status(200).json({ msg: "Delete Success" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
