import { Router } from "express";
import {
  applyForJob,
  cancelApply,
  deleteUser,
  getUser,
  updateUser,
} from "../controller/userController.js";
// import isAuthenticated from "../middleware/isAuth.js";

const router = Router();

router.route("/:username").get(getUser).patch(updateUser).delete(deleteUser);

router.post("/apply", applyForJob);
router.post("/cancel", cancelApply);

export default router;
