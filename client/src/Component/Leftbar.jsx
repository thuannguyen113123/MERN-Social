import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { AiOutlineCloseCircle } from "react-icons/ai";

const Leftbar = () => {
  const [post, setPost] = useState([]);
  const [listNotification, setListNotification] = useState([]);

  //Lấy người dùng hiện tại0
  const { currentUser } = useSelector((state) => state.user);

  let user = currentUser?.user;

  const id = user?._id;

  const getPost = async () => {
    try {
      const { data } = await axios.get(`/api/user/follow/${id}`);
      setPost(data.post);
    } catch (error) {
      console.log(error);
      // toast.error("Xảy ra lỗi khi nhận dữ liệu");
    }
  };

  const getNotifications = async () => {
    try {
      const res = await axios.get(`/api/user/get-notifications`);
      const data = res.data;

      if (data.success) {
        setListNotification(data.notifications);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotifications();
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hàm gửi yêu cầu xóa thông báo đến server
  const deleteNotificationInDatabase = async (id) => {
    try {
      const res = await axios.delete(`/api/user/delete-notification/${id}`);
      const data = res.data;
      if (!data.success) {
        console.log(data.massage);
      } else {
        setListNotification((prev) =>
          prev.filter((notification) => notification._id !== id)
        );
      }
    } catch (error) {
      console.log("Lỗi khi xóa thông báo từ server:", error);
      // Xử lý lỗi khi xóa thông báo từ server
    }
  };

  return (
    <div>
      <div className="shadow-lg bg-white dark:bg-[#29292a] w-[18pc] h-[60vh] mt-5 rounded-md flex-1 overflow-hidden overflow-y-scroll">
        <div className="flex justify-around">
          <span>Thông báo</span>
          <span>Xem tất cả</span>
        </div>
        {listNotification &&
          listNotification.map((notification, index) => (
            <div key={index} className="relative">
              <div className="flex items-center">
                <img
                  alt=""
                  src={notification?.senderId.profilePicture}
                  className="rounded-full object-cover w-10 h-10 "
                />
                <p className="ml-[5px]  text-[13px] text-start w-[120px]">
                  {notification?.message}
                </p>
                {notification?.postId?.image !== "" ? (
                  <img
                    src={notification?.postId?.image}
                    alt=""
                    className="w-[35px] h-[35px] ml-10"
                  />
                ) : (
                  <video className="w-[35px] h-[35px] ml-10">
                    <source src={notification?.postId.video} type="video/mp4" />
                  </video>
                )}
              </div>
              <AiOutlineCloseCircle
                className="absolute top-0 right-0 mr-1 mt-1 cursor-pointer"
                onClick={() => deleteNotificationInDatabase(notification._id)}
              />
            </div>
          ))}
      </div>
      <div className="shadow-lg bg-white dark:bg-[#29292a]  w-[18pc] h-[60vh] mt-5 rounded-md flex-1 overflow-hidden overflow-y-scroll">
        <div className="flex justify-around">
          <span>Khám phá</span>
          <span>Xem tất cả</span>
        </div>
        <div className="flex items-center flex-wrap ml-2">
          {post.map((item) => [
            item.image === "" ? (
              ""
            ) : (
              <img
                alt=""
                key={item._id}
                src={item.image}
                className="w-[86px] h-[140px] object-cover rounded-sm m-[2px]"
              />
            ),
          ])}
        </div>
      </div>
    </div>
  );
};

export default Leftbar;
