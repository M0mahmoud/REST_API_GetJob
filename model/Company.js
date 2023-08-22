import { Schema, model } from "mongoose";

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
    },
    companySize: {
      type: Number,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const Company = model("Company", CompanySchema);
export default Company;
