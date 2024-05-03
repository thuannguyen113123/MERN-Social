import React, { useState, useEffect } from "react";
import axios from "axios";
import Follow from "./Rightbar/Follow.jsx";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ProfileRightbar = () => {
  const [followersUser, setFollowersUser] = useState([]);

  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  let user = currentUser?.user;

  //Tham số hai là lấy id
  const { id } = useParams();
  const inforSuggest = user?._id;

  const getFollowers = async () => {
    try {
      const { data } = await axios.get(`/api/post/followers/${id}`);
      setFollowersUser(data.followersList);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFollowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = async () => {
    try {
      const { data } = await axios.get(`/api/user/all-user/${inforSuggest}`);
      setUsers(data.filterUser);
    } catch (error) {
      console.log(error);
      // toast.error("Xảy ra lỗi khi nhận dữ liệu");
    }
  };
  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div className="shadow-lg bg-white dark:bg-[#29292a] w-[20pc] h-[40vh] m-auto mt-5 rounded-md flex-1 overflow-scroll overflow-Y-hidden">
        <h4 className="text-center font-bold">Lượt theo dõi</h4>
        <div>
          {followersUser.map((item) => (
            <div
              key={item._id}
              className="flex items-center cursor-pointer ml-[10px]"
            >
              <img
                alt=""
                src={`${item.profilePicture}`}
                className="rounded-full w-10 h-10"
              />
              <span className="ml-[5px]">{item.username}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="shadow-lg bg-white dark:bg-[#29292a] w-[20pc] h-[40vh] m-auto mt-5 rounded-md flex-1 ">
        <p className="text-[18px] text-center">Đề nghị dành cho bạn</p>
        <div>
          {users.map((item) => (
            <Follow userdetails={item} key={item._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileRightbar;
