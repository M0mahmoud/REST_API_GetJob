import { Router } from "express";

import {
  getAllJobs,
  getOneJob,
  postNewJob,
} from "../controller/jobsController.js";
import isAuthenticated from "../middleware/isAuth.js";
const router = Router();

// Puplic Routes
router.get("/jobs", getAllJobs);
router.get("/job/:jobId", getOneJob);

// Private Routes
router.post("/post-job", isAuthenticated, postNewJob);

export default router;
