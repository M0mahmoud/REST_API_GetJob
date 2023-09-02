import { Router } from "express";

import { signIn, signUp } from "../controller/authController.js";
import { signInValidation, signUpValidation } from "../validation/auth.js";

const router = Router();

router.post("/signup", signUpValidation, signUp);
router.post("/signin", signInValidation, signIn);

export default router;
