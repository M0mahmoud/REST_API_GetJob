import { body, param } from "express-validator";

// export const validatePageParameter = [
//   param("page", "Page must be a positive integer").isInt({ min: 1 }), // Ensure it's a positive
// ];

export const validateJobIdParameter = [
  param("jobId", "Invalid job ID format").isMongoId(),
];

export const jobValidationRules = [
  body("title", "Title is required").notEmpty(),
  body("location", "Location is required").notEmpty(),
  body("jobType", "Job type is required").notEmpty(),
  body("description", "Description is required")
    .notEmpty()
    .isLength({ min: 25 }),
  body("skills", "kills must be an array").isArray().notEmpty(),
];
