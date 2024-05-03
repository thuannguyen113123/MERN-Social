import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    // Xử lý các trường hợp người dùng không nhập gì
    if (!name) {
      return res.send({ error: "Tên người dùng là bắt buộc" });
    }
    if (!email) {
      return res.send({ error: "Email là bắt buộc" });
    }
    if (!password) {
      return res.send({ error: "Mật khẩu là bắt buộc" });
    }
    if (!phone) {
      return res.send({ error: "Số điện thoại là bắt buộc" });
    }

    // Kiểm tra email của người dùng trong quá trình đăng ký
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Đăng ký không thành công. Email đã tồn tại.",
      });
    }

    const hashedPassword = await hashPassword(password);

    // Lưu lại trong cơ sở dữ liệu
    const user = await new userModel({
      username: name,
      email,
      phone,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "Đăng ký thành công tài khoản",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi đăng ký",
      error,
    });
  }
};
// Đăng nhập
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Kiểm tra
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Email hoặc mật khẩu không hợp lệ",
      });
    }

    // Kiểm tra email đã được đăng ký chưa
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email chưa được đăng ký",
      });
    }

    // Kiểm tra mật khẩu mã hóa và mật khẩu
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Mật khẩu không hợp lệ",
      });
    }

    // Gắn token khi đăng nhập vào web
    const token = await JWT.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .send({
        success: true,
        message: "Đăng nhập thành công",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          profilePicture: user.profilePicture,
          address: user.address,
          isAdmin: user.isAdmin,
        },
        token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Lỗi đăng nhập ở login",
      error,
    });
  }
};

// //Xữ lý đăng nhập với gg
export const loginWithGoogleController = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const token = JWT.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;

      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .send({
          success: true,
          message: "Đăng nhập thành công",
          user: rest,
          token,
        });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new userModel({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = JWT.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );

      const { password, ...rest } = newUser._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .send({
          success: true,
          message: "Đăng nhập thành công",
          user: rest,
          token,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Lỗi đăng nhập",
      error: error.message,
    });
  }
};
