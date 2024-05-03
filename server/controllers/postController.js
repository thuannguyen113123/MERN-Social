import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import messageModel from "../models/message.js";
import notificationModel from "../models/notificationModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler } from "./../middlewares/error.js";

dotenv.config();

//Tạo bài viết
export const createPostController = async (req, res) => {
  try {
    const { title, image, video } = req.body;

    const newPost = new postModel({
      title,
      image,
      video,
      user: req.user.id || req.user._id,
    });
    const post = await newPost.save();

    res.status(201).send({
      success: true,
      message: "Tạo bài viết thành công",
      createdAt: post.createdAt, // Ngày tạo bài viết
      updatedAt: post.updatedAt, // Ngày cập nhật mới nhất
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Lỗi khi tạo bài viết",
    });
  }
};

//Lấy bài viết từ người dùng
export const getSinglePostController = async (req, res) => {
  try {
    const myPost = await postModel.find({ user: req.params.id });

    if (!myPost) {
      return res
        .status(200)
        .send({ success: true, message: "Bạn không có bài viết nào" });
    }

    res.status(200).send({
      success: true,
      message: "Đã lấy được viết",
      myPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi trong lúc lấy bài viết",
      error,
    });
  }
};

//Lấy chi tiết bài viết để update
export const getDetailPostController = async (req, res) => {
  try {
    const postDetail = await postModel.findOne({ _id: req.params.pId });
    if (!postDetail) {
      return res
        .status(400)
        .send({ success: false, message: "Bài viết không tồn tại" });
    }
    res.status(200).send({
      success: true,
      message: "Đã lấy được bài viết",
      postDetail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi trong lúc lấy bài viết",
      error,
    });
  }
};

// //Cập nhật bài viết
export const updatePostController = async (req, res, next) => {
  try {
    if (
      req.user.id !== req.body.postData.user &&
      req.user._id !== req.body.postData.user
    ) {
      return next(
        errorHandler(403, "Bạn không được phép cập nhật thông báo này")
      );
    }
    const postData = req.body.postData; // Lấy dữ liệu từ postData

    let post = await postModel.findById(req.params.id);
    if (!post) {
      return res
        .status(200)
        .send({ success: false, message: "Không tìm thấy bài viết" });
    }
    // Sử dụng dữ liệu từ postData để cập nhật bài viết
    post.title = postData.title;
    post.image = postData.image;
    post.video = postData.video;

    const updatePost = await post.save();

    res.status(200).send({
      success: true,
      message: "Cập nhật thành công bài viết",
      updatePost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi trong lúc cập nhật bài viết",
      error,
    });
  }
};

//xữ like và dislike
export const likeController = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    const user = await userModel.findById(req.user.id);

    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Bài viết không tồn tại",
      });
    }

    if (!post.like.includes(req.user.id)) {
      if (post.dislike.includes(req.user.id)) {
        await post.updateOne({ $pull: { dislike: req.user.id } });
      }
      await post.updateOne({ $push: { like: req.user.id } });

      // Lấy tên người dùng
      const userName = user.username; // Giả sử tên người dùng được lưu trong trường 'username'

      // Tạo thông báo
      const notification = new notificationModel({
        senderId: user._id,
        recipientId: post.user,
        postId: post._id,
        message: `${userName} đã thích bài viết của bạn`,
      });

      // Lưu thông báo vào cơ sở dữ liệu
      await notification.save();

      return res.status(200).send({
        success: true,
        message: "Bài viết đã được thích",
      });
    } else {
      await post.updateOne({ $pull: { like: req.user.id } });

      // Xóa thông báo tương ứng
      await notificationModel.deleteOne({
        senderId: user._id,
        recipientId: post.user,
        postId: post._id,
        message: `${user.username} đã hủy thích bài viết của bạn`,
      });

      return res.status(200).send({
        success: true,
        message: "Bài viết không được thích nữa",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi trong lúc thích bài viết",
      error,
    });
  }
};

//Dislike
export const dislikeController = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post.dislike.includes(req.user.id)) {
      if (post.like.includes(req.user.id)) {
        await post.updateOne({ $pull: { like: req.user.id } });
      }
      await post.updateOne({ $push: { dislike: req.user.id } });
      return res.status(200).send({
        success: true,
        message: "Bài viết đã không được thích",
      });
    } else {
      await post.updateOne({ $pull: { dislike: req.user.id } });
      return res.status(200).send({
        success: true,
        message: "Bài đăng đã bị không thích",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi trong lúc dislike bài viết",
      error,
    });
  }
};

//Bình luận
export const commentController = async (req, res) => {
  try {
    const { comment, postid, profile, username } = req.body;
    console.log(req.user.id, postid, username, req.user._id);
    const comments = {
      user: req.user.id || req.user._id,
      username,
      comment,
      profile,
    };
    console.log(comments);
    const post = await postModel.findById(postid);
    post.comments.push(comments);

    await post.save();

    res.status(200).send({
      success: true,
      message: "Bình luận thành công",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi server",
      error,
    });
  }
};

//Xóa bình luận
export const deleteCommentController = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Tìm bài đăng theo ID
    const post = await postModel.findById(postId);

    // Kiểm tra xem post có tồn tại không
    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy bài đăng",
      });
    }

    // Kiểm tra xem bài đăng có thuộc tính comments không
    if (!post.comments || post.comments.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Bài đăng không có bình luận",
      });
    }

    // Tìm chỉ mục của bình luận trong mảng bình luận của bài đăng
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    // Kiểm tra xem bình luận có tồn tại không
    if (commentIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy bình luận",
      });
    }

    // Loại bỏ bình luận khỏi mảng bình luận
    post.comments.splice(commentIndex, 1);

    // Lưu bài đăng đã được cập nhật
    await post.save();

    res.status(200).send({
      success: true,
      message: "Xóa bình luận thành công",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi server",
      error,
    });
  }
};

//Xóa bài viết
export const deletePostController = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.user == req.user.id) {
      const deletePost = await postModel.findByIdAndDelete(req.params.id);
      res.status(200).send({
        success: true,
        message: "Bài đăng của bạn đã bị xóa",
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Bạn không được phép xóa bài viết này",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi server",
      error,
    });
  }
};

export const getAFollowingControler = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const followingUser = await Promise.all(
      user.Following.map((item) => {
        return userModel.findById(item);
      })
    );

    let followingList = [];

    followingUser.map((person) => {
      const { email, password, phonenumber, Following, Followers, ...others } =
        person._doc;
      followingList.push(others);
    });

    res.status(200).send({
      success: true,
      message: "Lấy người đang theo dõi mình thành công",
      followingList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

//Lấy người dùng mình follow
export const getAFollowersControler = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    const followerUser = await Promise.all(
      user.Followers.map((item) => {
        return userModel.findById(item);
      })
    );

    let followersList = [];

    followerUser.map((person) => {
      const { email, password, phonenumber, Following, Followers, ...others } =
        person._doc;
      followersList.push(others);
    });

    res.status(200).send({
      success: true,
      message: "Lấy người đang theo dõi mình thành công",
      followersList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi server",
      error,
    });
  }
};

export const createMessageController = async (req, res) => {
  try {
    const { from, to, message } = req.body;

    console.log(from, to, req.body, typeof from);

    const newMessage = await messageModel.create({
      message: message,
      Chatuser: [from, to],
      Sender: from,
    });

    return res.status(200).send({
      success: true,
      message: "Tạo tin nhắn thành công",
      newMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi server",
      error,
    });
  }
};

export const getMessageController = async (req, res) => {
  try {
    const from = req.params.user1Id;
    const to = req.params.user2Id;

    const newMessage = await messageModel
      .find({
        Chatuser: {
          $all: [from, to],
        },
      })
      .sort({ updateAt: 1 });

    const allMessage = newMessage.map((msg) => {
      return {
        myself: msg.Sender.toString() === from,
        message: msg.message,
        createdAt: msg.createdAt,
      };
    });

    return res.status(200).send({
      success: true,
      message: "Lấy tất cả tin nhắn từ người dùng thành công",
      allMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi server",
      error,
    });
  }
};
