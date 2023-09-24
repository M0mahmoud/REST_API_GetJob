import { Router } from "express";
import {
  applyForJob,
  cancelApply,
  checkApplication,
  deleteUser,
  forgetUserPassword,
  getUser,
  updateUserPassword,
  updateUserProfile,
} from "../controller/userController.js";
import isAuthenticated from "../middleware/isAuth.js";
import { ForgotPasswordValidation, UpdatePasswordValidation } from "../validation/auth.js";
const router = Router();

router
  .route("/:username", isAuthenticated)
  .get(getUser)
  .patch(updateUserProfile)
  .delete(deleteUser);

router.post("/forgetPassword", ForgotPasswordValidation, forgetUserPassword);
router.post("/updatePassword", UpdatePasswordValidation, updateUserPassword);

router.post("/apply", isAuthenticated, applyForJob);
router.post("/cancel", isAuthenticated, cancelApply);
router.post("/checkApplication", isAuthenticated, checkApplication);

export default router;
