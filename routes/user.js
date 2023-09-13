import { Router } from "express";
import {
  applyForJob,
  cancelApply,
  checkApplication,
  deleteUser,
  getUser,
  updateUser,
} from "../controller/userController.js";
import isAuthenticated from "../middleware/isAuth.js";

const router = Router();

router
  .route("/:username", isAuthenticated)
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

router.post("/apply", isAuthenticated, applyForJob);
router.post("/cancel", isAuthenticated, cancelApply);
router.post("/checkApplication", isAuthenticated, checkApplication);

export default router;
