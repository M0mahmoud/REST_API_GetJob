import Job from "../model/Job.js";
import User from "../model/User.js";

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
      msg: "User Found",
      user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  // TODO: Error handling
  const username = req.params.username;

  const { name } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      const error = new Error(`Could not find User!,${username}`);
      error.statusCode = 404;
      throw error;
    }

    user.name = name;

    await user.save();
    res.status(200).json({ msg: `User ${username} Update Scessfully`, user });
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
    return res.status(200).json({ msg: "Delete Success" });
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
      return res.status(404).json({ msg: "User not found!" });
    }
    if (!job) {
      return res.status(404).json({ msg: "Job not found!" });
    }

    if (!job.isOpen) {
      return res.status(404).json({ msg: "Job Closed...!" });
    }

    if (user.appliedJob.includes(jobId)) {
      return res
        .status(400)
        .json({ message: "User has already applied for this job" });
    }

    user.appliedJob.push(jobId);
    job.applicants.push(userId);
    job.numApplicants = job.applicants.length;

    await user.save();
    await job.save();

    res.status(201).json({ message: "Applied successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const cancelApply = async (req, res) => {
  const { jobId, userId } = req.body;

  try {
    const user = await User.findById(userId).populate("appliedJob");
    const job = await Job.findById(jobId).populate("applicants");

    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    if (!job) {
      return res.status(404).json({ msg: "Job not found!" });
    }
    if (!job.isOpen) {
      return res.status(404).json({ msg: "Job Closed...!" });
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

    return res
      .status(200)
      .json({ msg: "Application canceled successfully", user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
