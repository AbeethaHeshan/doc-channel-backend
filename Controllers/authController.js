import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Admin from "../models/AdminSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_kEY,
    {
      expiresIn: "15d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;
  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    } else if (role === "admin") {
      user = await Admin.findOne({email}) }
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }
    if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }
    if (role === "admin") {
      user = new Admin({
        name,
        email,
        password: hashPassword,
        photo,
        role,
      });
    }
    console.log('user', user)
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User created Successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error, Try Again" });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;
  try {
    let user = null;

    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });
    const admin = await Admin.findOne({ email });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }
    if(admin) {
      user = admin
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Credentials" });
    }

    const token = generateToken(user);

    const { password, role, appointments, ...rest } = user._doc;

    res.status(200).json({
      status: true,
      message: "Successfully logged in",
      token,
      data: { ...rest },
      role,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Login Failed" });
  }
};
