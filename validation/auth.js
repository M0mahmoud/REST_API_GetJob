import { body } from "express-validator";

export const signUpValidation = [
  body("email", "Enter valid email...").isEmail().notEmpty(),
  body("name").notEmpty(),
  body("username", "Username must be between 3 and 15 characters")
    .notEmpty()
    .toLowerCase()
    .isLength({ min: 3, max: 15 }),
  body("password", "Password must be more than 12 characters")
    .notEmpty()
    .toLowerCase()
    .isLength({ min: 12 }),
];
export const signInValidation = [
  body("email", "Enter valid email...").isEmail().notEmpty(),
  body("password", "Enter more than 12 characters")
    .notEmpty()
    .toLowerCase()
    .isLength({ min: 12 }),
];
