import { Router } from "express";

import {
  deleteJob,
  getAllJobs,
  getOneJob,
  postNewJob,
  updateJob,
} from "../controller/jobsController.js";
import isAuthenticated from "../middleware/isAuth.js";
import {
  jobValidationRules,
  validateJobIdParameter,
} from "../validation/job.js";
const router = Router();

// Puplic Routes
router.get("/jobs", getAllJobs);
router.get("/job/:jobId", validateJobIdParameter, getOneJob);

// Private Routes
router.post("/post-job", isAuthenticated, jobValidationRules, postNewJob);
router.patch(
  "/update-job/:jobId",
  isAuthenticated,
  jobValidationRules,
  updateJob
);
router.delete("/delete-job/:jobId", isAuthenticated, deleteJob);

export default router;
