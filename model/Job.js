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
      enum: ["full-time", "part-time", "internship", "remote", "contract"],
      default: "full-time",
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
    level: {
      type: String,
      enum: ["entry-level", "mid-level", "senior-level"],
      default: "senior-level",
    },
  },
  { timestamps: true }
);

const Job = model("Job", JobSchema);
export default Job;
