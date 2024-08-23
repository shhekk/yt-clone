import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/createToken.js";
import { ApiError } from "../utils/apiError.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.json({ msg: "all credential required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ msg: "existing user" });

    const user = await User.create({ email, username, password });

    if (!user) res.json({ msg: "signup failed" });
    const token = await createToken(user._id);
    // console.log(token);

    const cookieOptions = {
      httpOnly: true,   //js cant touch this
      maxAge: 3 * 24 * 60 * 60 * 1000,  //3days
      sameSite: 'lax',    
      secure: process.env.NODE_ENV === 'production' //true for production send only in https
    };
    res.cookie("token", token, cookieOptions);

    return res.json({ msg: "signed in success" });

    next();
  } catch (error) {
    next();
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`login email:${email}`);
    if (!email || !password) throw new ApiError("all feilds required", 403 )
  
    const user = await User.findOne({ email });
    if (!user) throw new ApiError("invalid email", 403)
  
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) throw new ApiError('Incorrect password', 401)
  
    const token = await createToken(user._id);

    const cookieOptions = {
      httpOnly: true,   //js cant touch this
      maxAge: 3 * 24 * 60 * 60 * 1000,  //3days
      sameSite: 'none',    
      secure: process.env.NODE_ENV === 'production' //true for production send only in https
    };
    res.cookie("token", token, cookieOptions);
  
    return res.status(200).json({ msg: "user logged in successfully" });
  } catch (error) {
    next(error)
  }
};
