import express from "express";
import {
  registerController,
  loginController,
  loginWithGoogleController,
} from "../controllers/authController.js";
// import { verifyToken } from "../utils/verifyUser.js";

//router
const router = express.Router();

//Đăng ký
router.post("/register", registerController);

//Đăng nhập
router.post("/login", loginController);
//Đăng nhập bằng gg
router.post("/google", loginWithGoogleController);

export default router;
