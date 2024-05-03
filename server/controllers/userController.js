import notificationModel from "../models/notificationModel.js";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

// đăng xuất
export const signOutController = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .send({ success: true, message: "đăng xuất thành công" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lỗi đăng xuất",
      error,
    });
  }
};

//Theo dõi
export const getSingleFollowingController = async (req, res) => {
  //Kiểm tra Id truyền qua url có khác với id truyền trong yêu cầu(để kiểm tra xem người dùng này đã theo dõi người dùng kia chưa)
  //Nếu rồi thì bỏ theo dõi nếu chưa thì theo dõi
  if (req.params.id !== req.body.user) {
    const user = await userModel.findById(req.params.id);
    const otherUser = await userModel.findById(req.body.user);
    //includes(kiểm tra phần tử có tồn tại hay chưa)
    if (!user.Followers.includes(req.body.user)) {
      //updateOne(cập nhật 1 phần tử duy nhất trong csdl)
      //$push thêm 1 dữ liệu vào mảng
      await user.updateOne({ $push: { Followers: req.body.user } });
      await otherUser.updateOne({ $push: { Following: req.params.id } });
      return res
        .status(200)
        .send({ success: true, message: "Người dùng đã theo dõi" });
    } else {
      await user.updateOne({ $pull: { Followers: req.body.user } });
      await otherUser.updateOne({ $pull: { Following: req.params.id } });
      return res
        .status(200)
        .send({ success: true, message: "Người dùng đã hủy theo dõi" });
    }
  } else {
    return res
      .status(400)
      .send({ success: false, message: "Bạn không thể theo dõi chính mình" });
  }
};
//Lấy các bài đăng của người dùng đã fl
export const getPostFromUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    const followersPost = await Promise.all(
      user.Following.map((item) => {
        return postModel.find({ user: item });
      })
    );
    const userPost = await postModel.find({ user: user._id });

    return res.status(200).send({
      success: true,
      message: "Lấy thành công",
      post: [...userPost, ...followersPost.flat()],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Lỗi từ Server",
      error,
    });
  }
};
export const updateUserController = async (req, res, next) => {
  if (req.user.id !== req.params.userId && req.user._id !== req.params.userId) {
    return next(
      errorHandler(403, "Bạn không được phép cập nhật người dùng này")
    );
  }

  try {
    let updatedFields = {
      username: req.body.username,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
    };

    // Nếu người dùng đã có thông tin address và phone
    if (req.body.phone) {
      updatedFields.phone = req.body.phone;
    } else {
      // Nếu không có thông tin address và phone, kiểm tra nếu đã có sẵn trong database và cập nhật lại
      const existingUser = await userModel.findById(req.params.userId);
      if (existingUser.phone) {
        updatedFields.phone = existingUser.phone;
      }
    }

    // Thực hiện cập nhật hoặc thêm mới thông tin
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: {
          ...updatedFields,
          password: req.body.password
            ? await hashPassword(req.body.password)
            : undefined, // Chỉ mã hóa mật khẩu nếu mật khẩu được cung cấp
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).send({
      success: true,
      message: "Cập nhật thành công",
      user: rest,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lỗi cập nhật",
      error,
    });
  }
};

//Người dùng tự xóa tài khoản
export const deleteUserController = async (req, res, next) => {
  if (
    !req.user.isAdmin &&
    req.user.id !== req.params.userId &&
    req.user._id !== req.params.userId
  ) {
    return next(errorHandler(403, "Bạn không được phép xóa người dùng này"));
  }
  try {
    await userModel.findByIdAndDelete(req.params.userId);
    res.status(200).send({
      success: true,
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lỗi xóa tài khoản",
      error,
    });
  }
};

export const getUserDetailController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }
    const { email, password, phonenumber, ...others } = user._doc;
    return res.status(200).send({
      success: true,
      message: "Lấy thông tin người dùng thành công",
      others,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Lỗi từ Server",
      error,
    });
  }
};
//Lấy tất cả user mình follow
export const getAllUserFollowController = async (req, res) => {
  try {
    const allUser = await userModel.find();
    const user = await userModel.findById(req.params.id);
    //Promise.all chờ để lấy hết danh sách
    const followingUser = await Promise.all(
      user.Following.map((item) => {
        return item;
      })
    );
    let userToFollow = allUser.filter((val) => {
      return !followingUser.find((item) => {
        return val._id.toString() === item;
      });
    });

    let filterUser = await Promise.all(
      userToFollow.map((item) => {
        const {
          email,
          phonenumber,
          Followers,
          Following,
          password,
          ...others
        } = item._doc;
        return others;
      })
    );
    return res.status(200).send({
      success: true,
      message: "Lấy thông tin người dùng đã follow thành công",
      filterUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Lỗi từ Server",
      error,
    });
  }
};

export const getAllUserController = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit);
    let query = {}; // Khởi tạo query rỗng

    if (req.query.searchTerm) {
      // Kiểm tra nếu searchTerm được truyền vào
      const searchTermLower = req.query.searchTerm.toLowerCase();
      // Xây dựng điều kiện tìm kiếm từ searchTerm
      query = {
        $or: [
          { email: { $regex: searchTermLower, $options: "i" } },
          { username: { $regex: searchTermLower, $options: "i" } },
        ],
      };
    }

    const usersQuery = userModel.find(query);
    if (limit) {
      // Nếu limit được truyền vào
      usersQuery.limit(limit); // Áp dụng limit nếu có
    }

    const users = await usersQuery.skip(startIndex);

    // Trả về kết quả và thông tin
    res.status(200).send({
      success: true,
      message: "Tất cả người dùng",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Xảy ra lỗi khi lấy người dùng",
      error: error.message,
    });
  }
};

export const getNofiticationsController = async (req, res) => {
  try {
    const recipientId = req.user.id || req.user._id;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit);

    console.log(recipientId);

    let query = { recipientId }; // Khởi tạo query rỗng

    const notificationQuery = notificationModel.find(query);
    if (limit) {
      // Nếu limit được truyền vào
      notificationQuery.limit(limit); // Áp dụng limit nếu có
    }

    const notifications = await notificationQuery
      .skip(startIndex)
      .populate("postId")
      .populate("senderId")
      .populate("recipientId");

    // Trả về kết quả và thông tin
    res.status(200).send({
      success: true,
      message: "Tất cả thông báo",
      notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Xảy ra lỗi khi xóa thông báo cho người dùng",
      error: error.message,
    });
  }
};

// Xóa thông báo của người dùng dựa trên index
export const deleteNotificationController = async (req, res) => {
  try {
    const { userId } = req.params; // Nhận id của người dùng và index của thông báo từ request

    console.log(req.params);

    if (req.user.id !== userId && req.user._id !== userId) {
      return next(errorHandler(403, "Bạn không được phép xóa thông báo này"));
    }

    await notificationModel.findByIdAndDelete(req.params.nId);

    // Trả về phản hồi thành công
    res.status(200).send({
      success: true,
      message: "Thông báo đã được xóa thành công cho người dùng",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Xảy ra lỗi khi xóa thông báo cho người dùng",
      error: error.message,
    });
  }
};
