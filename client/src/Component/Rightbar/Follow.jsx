import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "flowbite-react";
import { toast } from "react-toastify";

const Follow = ({ userdetails, setRenderUser }) => {
  const [follow, setFollow] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleFollow = async () => {
    try {
      await axios.put(`/api/user/following/${userdetails._id}`, {
        user: currentUser.user._id,
      });
      setFollow((prevFollow) => !prevFollow);
      setRenderUser((prev) => !prev);
      toast.success("Theo dõi người dùng thành công");
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error(error);
      toast.error("Đã xảy ra lỗi khi theo dõi người dùng");
    }
  };

  return (
    <div className="flex justify-between items-center mt-1">
      <div className="flex flex-1 items-center mx-2 gap-2 hover:bg-gray-200 dark:hover:bg-slate-700 ">
        <img
          alt={userdetails.profilePicture}
          src={userdetails.profilePicture}
          className="w-10 h-10 mt-2 rounded-full"
        />
        <Link to={`/Profile/${userdetails._id}`}>
          <span>{userdetails.username}</span>
        </Link>
      </div>
      <Button onClick={handleFollow} className="border-none">
        <FaUserPlus className="w-5 h-5 text-black dark:text-white hover:rotate-10 hover:scale-125" />
      </Button>
    </div>
  );
};

export default Follow;
