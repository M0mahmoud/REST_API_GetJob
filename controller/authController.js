import bcrypt from "bcryptjs";

import User from "../model/User.js";

export async function signUp(req, res, next) {
  //TODO validation error soon
  const { name, email, password } = req.body;

  try {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(422).json({ msg: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      name,
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
  //TODO validation error soon
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(422).json({ msg: "A User With This Email Not Found!" });
    }

    const isSame = await bcrypt.compare(password, userExist.password);
    if (!isSame) {
      return res.status(422).json({ msg: "Wrong Password...!" });
    }

    //TODO Jwt Authentication Token

    return res.status(200).json({ userId: String(userExist._id) });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
