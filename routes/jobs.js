import { Router } from "express";

import {
  deleteJob,
  getAllJobs,
  getOneJob,
  postNewJob,
  updateJob,
} from "../controller/jobsController.js";
import isAuthenticated from "../middleware/isAuth.js";
const router = Router();

// Puplic Routes
router.get("/jobs/:page", getAllJobs);
router.get("/job/:jobId", getOneJob);

// Private Routes
router.post("/post-job", isAuthenticated, postNewJob);
router.patch("/update-job/:jobId", isAuthenticated, updateJob);
router.delete("/delete-job/:jobId", isAuthenticated, deleteJob);

export default router;
