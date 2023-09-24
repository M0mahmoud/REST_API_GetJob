import { validationResult } from "express-validator";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

import Job from "../model/Job.js";
import User from "../model/User.js";
import HttpStatus from "../utils/HttpStatus.js";
import { ResetPasswordTemplate } from "../utils/templates/EmailTemplate.js";

export const getUser = async (req, res, next) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username }).populate("appliedJob");
    if (!user) {
      const error = new Error(`Could not find User!,${username}`);
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: HttpStatus.SUCCESS,
      data: {
        user,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateUserProfile = async (req, res, next) => {
  // TODO: Error handling
  const userParams = req.params.username;
  const { email, name, username, title } = req.body;

  try {
    const user = await User.findOne({ username: userParams });
    if (!user) {
      const error = new Error(`Could not find User!,${userParams}`);
      error.statusCode = 404;
      throw error;
    }

    user.name = name;
    user.email = email;
    user.username = username;
    user.title = title;

    await user.save();
    res.status(200).json({ status: HttpStatus.SUCCESS, data: { user } });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const forgetUserPassword = async (req, res, next) => {
  const { email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ status: HttpStatus.FAIL, data: { errors: errors.array() } });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error(`Could not find User!`);
      error.statusCode = 404;
      throw error;
    }

    const token = Jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    user.resetToken = token;
    await user.save();

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.email",
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASSWORD_MAIL,
      },
    });

    const url = `http://localhost:5173/reset-password?token=${token}`;

    const MessageContent = ResetPasswordTemplate.replace("LINK", url);

    const message = {
      from: "getJob@job.com",
      to: email,
      subject: "Password Reset Request🔰",
      html: MessageContent,
    };
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log("ERROR FROM MSG-------------\n", err);
      } else {
        console.log("DONE----------------\n", info);
        if (!info.accepted) {
        }
      }
    });

    return res.status(200).json({
      status: HttpStatus.SUCCESS,
      data: { msg: "Password reset email sent ✅" },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
export const updateUserPassword = async (req, res, next) => {
  const { password, email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ status: HttpStatus.FAIL, data: { errors: errors.array() } });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error(`Could not find User!`);
      error.statusCode = 404;
      throw error;
    }
    const hashPassword = await bcrypt.hash(password, 12);
    user.password = hashPassword;
    await user.save();

    return res.status(200).json({
      status: HttpStatus.SUCCESS,
      data: { msg: "Password Updated...✅" },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      const error = new Error(`Could not find User!,${username}`);
      error.statusCode = 404;
      throw error;
    }
    // TODO: DELETE From User Job Application
    await User.findOneAndDelete({ username });
    return res.status(200).json({ status: HttpStatus.SUCCESS, data: null });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const applyForJob = async (req, res, next) => {
  const { jobId, userId } = req.body;
  try {
    const job = await Job.findById(jobId);
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: HttpStatus.ERROR, data: { msg: "User not found!" } });
    }
    if (!job) {
      return res
        .status(404)
        .json({ status: HttpStatus.ERROR, data: { msg: "Job not found!" } });
    }

    if (!job.isOpen) {
      return res
        .status(404)
        .json({ status: HttpStatus.ERROR, data: { msg: "Job Closed...!" } });
    }

    if (user.appliedJob.includes(jobId)) {
      return res.status(400).json({
        status: HttpStatus.FAIL,
        data: { msg: "User has already applied for this job" },
      });
    }

    user.appliedJob.push(jobId);
    job.applicants.push(userId);
    job.numApplicants = job.applicants.length;

    await user.save();
    await job.save();

    res.status(201).json({ status: HttpStatus.SUCCESS, data: null });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const cancelApply = async (req, res, next) => {
  const { jobId, userId } = req.body;

  try {
    const user = await User.findById(userId).populate("appliedJob");
    const job = await Job.findById(jobId).populate("applicants");

    if (!user) {
      return res
        .status(404)
        .json({ status: HttpStatus.ERROR, data: { msg: "User not found!" } });
    }
    if (!job) {
      return res
        .status(404)
        .json({ status: HttpStatus.ERROR, data: { msg: "Job not found!" } });
    }

    if (!job.isOpen) {
      return res
        .status(404)
        .json({ status: HttpStatus.ERROR, data: { msg: "Job Closed...!" } });
    }

    const filterUserJobs = user.appliedJob.filter(
      (job) => String(job._id) !== jobId
    );
    const filterJobs = job.applicants.filter(
      (job) => String(job._id) !== userId
    );

    user.appliedJob = filterUserJobs;
    job.applicants = filterJobs;
    job.numApplicants = job.applicants.length;

    await user.save();
    await job.save();

    return res.status(200).json({ status: HttpStatus.SUCCESS, data: null });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
export const checkApplication = async (req, res, next) => {
  const { jobId, userId } = req.body;

  try {
    const user = await User.findById(userId).populate("appliedJob");
    const job = await Job.findById(jobId).populate("applicants");

    if (!user) {
      return res
        .status(404)
        .json({ status: HttpStatus.ERROR, data: { msg: "User not found!" } });
    }
    if (!job) {
      return res
        .status(404)
        .json({ status: HttpStatus.ERROR, data: { msg: "Job not found!" } });
    }

    if (!job.isOpen) {
      return res
        .status(404)
        .json({ status: HttpStatus.ERROR, data: { msg: "Job Closed...!" } });
    }

    const hasApplied = user.appliedJob.some((job) => String(job._id) === jobId);

    return res
      .status(200)
      .json({ status: HttpStatus.SUCCESS, data: { hasApplied } });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
