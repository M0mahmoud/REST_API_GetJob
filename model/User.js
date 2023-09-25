import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
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
    appliedJob: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    bio: String,
    title: String,
    resetToken: String,
    skills: [{ value: String, label: String }],
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
export default User;
