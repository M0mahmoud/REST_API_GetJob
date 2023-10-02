import { validationResult } from "express-validator";
import { Types } from "mongoose";
import Job from "../model/Job.js";
import HttpStatus from "../utils/HttpStatus.js";

export const getAllJobs = async (req, res, next) => {
  const { page, level, type } = req.query;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ status: HttpStatus.FAIL, data: { errors: errors.array() } });
  }

  let PEER_PAGE = 10;
  const skipAmount = (page - 1) * PEER_PAGE;

  const query = {};
  if (level) query.level = { $in: level.split(" ") };
  if (type) query.jobType = { $in: type.split(" ") };

  try {
    const allJobCount = await Job.find().countDocuments();
    const filterJobCount = await Job.find(query).countDocuments();
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(PEER_PAGE);

    const isNext = filterJobCount > skipAmount + jobs.length;

    res.status(200).json({
      status: HttpStatus.SUCCESS,
      data: {
        jobs,
        isNext,
        allJobCount,
      },
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
    return res
      .status(422)
      .json({ status: HttpStatus.FAIL, data: { errors: errors.array() } });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      const error = new Error("Could not find This Job!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: HttpStatus.SUCCESS,
      data: {
        job,
      },
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
    return res
      .status(422)
      .json({ status: HttpStatus.FAIL, data: { errors: errors.array() } });
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
      skills,
    });
    await newJob.save();
    return res.status(201).json({
      status: HttpStatus.SUCCESS,
      data: {
        job: newJob,
      },
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
  const { title, location, jobType, description, skills, level } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ status: HttpStatus.FAIL, data: { errors: errors.array() } });
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
    job.skills = skills;
    job.level = level;

    await job.save();
    res.status(200).json({ status: HttpStatus.SUCCESS, data: { job } });
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
    return res.status(200).json({ status: HttpStatus.SUCCESS, data: null });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
