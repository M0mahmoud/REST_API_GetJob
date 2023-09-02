import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

import { validationResult } from "express-validator";
import User from "../model/User.js";

export async function signUp(req, res, next) {
  const { name, email, password, username } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(422).json({ msg: "Email already exists" });
    }

    const userNameExist = await User.findOne({ username });
    if (userNameExist) {
      return res.status(422).json({ msg: "UserName already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      name,
      username,
      password: hashPassword,
    });
    await newUser.save();
    return res
      .status(201)
      .json({ msg: "User successfully Created", userId: newUser._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
export async function signIn(req, res, next) {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(422).json({ msg: "A User With This Email Not Found!" });
    }

    const isSame = await bcrypt.compare(password, userExist.password);
    if (!isSame) {
      return res.status(422).json({ msg: "Wrong Password...!" });
    }

    const token = Jwt.sign(
      { email: userExist.email, userId: String(userExist._id) },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    return res.status(200).json({
      token,
      userId: String(userExist._id),
      username: userExist.username,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
