import React, { useState, useEffect } from "react";
import axios from "axios";

import Follow from "./Follow.jsx";
import { useSelector } from "react-redux";

const Rightbar = () => {
  const [users, setUsers] = useState([]);
  const [renderUser, setRenderUser] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const id = currentUser.user._id;

  const getUser = async () => {
    try {
      const { data } = await axios.get(`/api/user/all-user/${id}`);
      setUsers(data.filterUser);
    } catch (error) {
      console.log(error);
      //   toast.error("Xảy ra lỗi khi nhận dữ liệu");
    }
  };
  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderUser]);
  console.log(users);

  return (
    <div>
      <div className="shadow-lg bg-white dark:bg-[#29292a] w-[20pc] h-[40vh] mt-5 rounded-md flex-1 overflow-hidden overflow-y-scroll">
        <div className="flex item-center ml-[10px] p-1">
          <img
            alt=""
            src="http://bizweb.dktcdn.net/100/060/439/files/poster-quang-cao-sua-vinamilk-07.jpg?v=1470526115254"
            className="w-[130px] h-[80px] object-cover rounded-sm"
          />
          <div>
            <span className="text-start ml-[10px] text-[12px] mt-[-16px]">
              Chương Trình quảng cáo
            </span>
          </div>
        </div>
        <div className="flex item-center ml-[10px] p-1">
          <img
            alt=""
            src="http://bizweb.dktcdn.net/100/060/439/files/poster-quang-cao-sua-vinamilk-07.jpg?v=1470526115254"
            className="w-[130px] h-[80px] object-cover rounded-sm"
          />
          <div>
            <span className="text-start ml-[10px] text-[12px] mt-[-16px]">
              Chương Trình quảng cáo
            </span>
          </div>
        </div>
        <div className="flex item-center ml-[10px] p-1">
          <img
            alt=""
            src="http://bizweb.dktcdn.net/100/060/439/files/poster-quang-cao-sua-vinamilk-07.jpg?v=1470526115254"
            className="w-[130px] h-[80px] object-cover rounded-sm"
          />
          <div>
            <span className="text-start ml-[10px] text-[12px] mt-[-16px]">
              Chương Trình quảng cáo
            </span>
          </div>
        </div>
      </div>
      <div className="shadow-lg bg-white  dark:bg-[#29292a] w-[20pc] h-[40vh] mt-5 rounded-md flex-1 overflow-hidden overflow-y-scroll">
        <h2 className="text-center text-[18px]">Đề nghị dành cho bạn</h2>
        <div>
          {users.map((item, index) => (
            <Follow
              userdetails={item}
              key={index}
              setRenderUser={setRenderUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
