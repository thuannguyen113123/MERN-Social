import React, { useState, useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button } from "flowbite-react";
import { toast } from "react-toastify";

const ProfileLeftbar = () => {
  //Tham số hai là lấy id
  const { id } = useParams();

  const [users, setUsers] = useState([]);

  const { currentUser } = useSelector((state) => state.user);
  let user = currentUser.user;

  const [follow, setFollow] = useState(
    user.Following?.includes(id) ? "Hủy theo dõi" : "Theo dõi"
  );

  const [followingUser, setFollowingUser] = useState([]);

  const getFollowing = async () => {
    try {
      const { data } = await axios.get(`/api/post/following/${id}`);
      setFollowingUser(data.followingList);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const { data } = await axios.get(`/api/user/post/user-details/${id}`);
      setUsers(data.others);
    } catch (error) {
      console.log(error);
      //   toast.error("Xảy ra lỗi khi nhận dữ liệu");
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  //Xữ lý theo dõi
  const handleFollow = async () => {
    if (follow === "Theo dõi") {
      axios.put(`/api/user/following/${id}`, { user: `${user._id}` });
      setFollow("Hủy theo dõi");
      toast.success("Hủy Theo dõi thành công");
    } else {
      await axios.put(`/api/user/following/${id}`, {
        user: `${user._id}`,
      });
      setFollow("Theo dõi");
      toast.success("Theo dõi thành công");
    }
  };

  useEffect(() => {
    // Khi id thay đổi, gọi lại các hàm để lấy dữ liệu mới
    getUser();
    getFollowing();
  }, [id]); // Khi id thay đổi
  return (
    <div>
      <div className="shadow-lg bg-white  dark:bg-[#29292a] w-[20pc] h-[50vh] mt-5 rounded-md flex-1 ">
        <img
          alt=""
          src="https://tse4.mm.bing.net/th?id=OIP.Pw9nEeFaAB8LhHt_cGihqgHaEc&pid=Api&P=0&h=180"
          className="w-full h-[100px] object-cover z-10"
        />
        <div className="flex items-center ">
          <img
            alt=""
            src={users.profilePicture}
            className="w-[60px] h-[60px] rounded-full object-cover ml-[10px] z-20"
          />
          <div className="mt-5 z-20 flex flex-col">
            <span className="ml-1">{users.username}</span>
            <span className="ml-1 text-[12px]">Nhà báo</span>
          </div>
        </div>

        <div className="z-20 mt-1 flex justify-between">
          <span className="ml-[10px]">Đang theo dõi</span>
          <span className="mr-[10px]">{users?.Following?.length}</span>
        </div>
        <div className="border-b-1 border-gray" />
        <div className="z-20 mt-[5px] flex justify-between">
          <span className="ml-[10px]">Theo dõi</span>
          <span className="mr-[10px]"> {users?.Followers?.length}</span>
        </div>
        <div className="border-b-1 border-gray" />
        <div className="z-20 mt-[5px]">
          <p className="text-start font-bold">Người dùng</p>
          <p className="mx-[10px] my-[5px] text-[#aaa]">
            Tôi thà bị người khác coi thường còn hơn là được yêu thương bởi
            người không phải là tôi
          </p>
        </div>
        {user._id !== id ? (
          <Button onClick={handleFollow} className="w-full bg-blue-500 my-5">
            {follow}
          </Button>
        ) : (
          <Link to="/dashboard?tab=profile">
            <Button className="w-full bg-blue-500 my-5">Cập nhật</Button>
          </Link>
        )}
      </div>
      <div className="bg-white dark:bg-[#29292a] w-[18pc 60vh] mt-8 rounded-md overflow-hidden overflow-Y-scroll">
        <h4 className="font-bold text-center">Danh sách bạn bè</h4>
        <div className="m-[10px] flex justify-between">
          <span>Đang theo dõi</span>
          <span className="text-[#aaa]">Xem tất cả</span>
        </div>
        <div className="flex-wrap m-[10px]">
          {followingUser.map((item) => (
            <Link
              to={`/Profile/${item._id}`}
              className="ml-[5px] flex gap-2 items-center"
              key={item._id}
            >
              <img
                alt=""
                src={`${item.profilePicture}`}
                className="w-10 h-10 object-cover rounded-full"
              />
              <span textAlign="center" sx={{ color: "inherit" }}>
                {item.username}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftbar;
