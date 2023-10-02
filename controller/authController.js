import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import { validationResult } from "express-validator";
import User from "../model/User.js";
import HttpStatus from "../utils/HttpStatus.js";
import {
  signInEmailTemplate,
  signUpEmailTemplate,
} from "../utils/templates/EmailTemplate.js";

export async function signUp(req, res, next) {
  const { name, email, password, username } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ status: HttpStatus.FAIL, data: { errors: errors.array() } });
  }

  try {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(422).json({
        status: HttpStatus.FAIL,
        data: { msg: "Email already exists" },
      });
    }

    const userNameExist = await User.findOne({ username });
    if (userNameExist) {
      return res.status(422).json({
        status: HttpStatus.FAIL,
        data: { msg: "UserName already exists" },
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      name,
      username,
      password: hashPassword,
    });
    await newUser.save();

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.email",
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASSWORD_MAIL,
      },
    });

    const message = {
      from: "getJob@job.com",
      to: email,
      subject: "SignUp Successfully ✅",
      html: signUpEmailTemplate,
    };
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log("ERROR FROM MSG-------------\n", err);
      } else {
        console.log("DONE----------------\n", info);
        if (!info.accepted) {
        }
      }
    });

    return res
      .status(201)
      .json({ status: HttpStatus.SUCCESS, data: { userId: newUser._id } });
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
    return res
      .status(422)
      .json({ status: HttpStatus.FAIL, data: { errors: errors.array() } });
  }

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(422).json({
        status: HttpStatus.FAIL,
        data: { msg: "A User With This Email Not Found!" },
      });
    }

    const isSame = await bcrypt.compare(password, userExist.password);
    if (!isSame) {
      return res
        .status(422)
        .json({ status: HttpStatus.FAIL, data: { msg: "Wrong Password...!" } });
    }

    const token = Jwt.sign(
      { email: userExist.email, userId: String(userExist._id) },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.email",
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASSWORD_MAIL,
      },
    });
    const userAgent = req.useragent;
    const browser = userAgent.browser || "Unknown Browser";
    const os = userAgent.os || "Unknown OS";

    const signInEmailContent = signInEmailTemplate
      .replace("[User's Name]", userExist.name)
      .replace("[Sign-In Time]", new Date().toLocaleString())
      .replace("[Browser]", browser)
      .replace("[Operating System]", os)
      .replace("[Support Link]", "https://m05.vercel.app/");

    const message = {
      from: "getJob@job.com",
      to: email,
      subject: "SignIn Notification ✅",
      html: signInEmailContent,
    };
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log("ERROR FROM MSG-------------\n", err);
      } else {
        console.log("DONE----------------\n", info);
        if (!info.accepted) {
        }
      }
    });

    return res.status(200).json({
      status: HttpStatus.SUCCESS,
      data: {
        token,
        userId: String(userExist._id),
        username: userExist.username,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
