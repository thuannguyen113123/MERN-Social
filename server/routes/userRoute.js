import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";

import {
  signOutController,
  getPostFromUserController,
  getSingleFollowingController,
  getUserDetailController,
  getAllUserFollowController,
  updateUserController,
  deleteUserController,
  getAllUserController,
  deleteNotificationController,
  getNofiticationsController,
} from "./../controllers/userController.js";

//router
const router = express.Router();

//Đăng xuất
router.post("/signout", signOutController);

//Theo dõi
router.put("/following/:id", requireSignIn, getSingleFollowingController);
// Lấy các bài viết của người dùng đã follow
router.get("/follow/:id", requireSignIn, getPostFromUserController);

//Cập nhật người dùng
router.put("/update/:userId", requireSignIn, updateUserController);
//Xoá tài khoản
router.delete("/delete/:userId", requireSignIn, deleteUserController);

//Lấy tất cả bài post của mình
router.get("/post/user-details/:id", getUserDetailController);
//Lấy tất cả người dùng mình follow
router.get("/all-user/:id", getAllUserFollowController);
//Lấy tất cả user Tiện việc tìm kiếm
router.get("/get-allUser", getAllUserController);
//Lấy thông báo
router.get("/get-notifications", requireSignIn, getNofiticationsController);
//Xóa thông báo
router.delete(
  "/delete-notification/:nId",
  requireSignIn,
  deleteNotificationController
);

export default router;
