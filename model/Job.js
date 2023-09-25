import { Schema, model } from "mongoose";

const JobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
    },
    description: {
      type: String,
    },
    skills: [{ value: String, label: String }],
    isOpen: {
      type: Boolean,
      default: true,
    },
    applicants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    numApplicants: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Job = model("Job", JobSchema);
export default Job;
