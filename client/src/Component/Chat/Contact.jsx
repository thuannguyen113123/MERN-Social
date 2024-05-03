import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatContainer from "./ChatContainer";
import { FaSearch } from "react-icons/fa";

const Contact = () => {
  const { currentUser } = useSelector((state) => state.user);
  let user = currentUser.user;

  let id = user._id;
  const [users, setUsers] = useState();
  const [currentChatUser, setCurrentChatUser] = useState("");

  const getUser = async () => {
    try {
      const { data } = await axios.get(`/api/post/following/${id}`);
      setUsers(data.followingList);
    } catch (error) {
      //   toast.error("Xảy ra lỗi khi nhận dữ liệu");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleUser = (e) => {
    setCurrentChatUser(e);
  };

  return (
    <div className="flex flex-1 mt-1 overflow-hidden max-w-6xl mx-auto">
      <div className="overflow-hidden overflow-y-auto ">
        <div className="flex justify-center">
          <div className="flex items-center justify-between w-[300px] h-[30px] bg-white dark:bg-[#29292a] rounded-lg shadow-lg">
            <input
              type="search"
              placeholder="Tìm kiếm bạn bè"
              className="flex-1 bg-transparent border-none p-2.5 text-base focus:outline-none focus:ring-0 focus:ring-offset-0"
            />
            <button
              type="submit"
              className="p-2.5 text-red-500 hover:rotate-10 hover:scale-125"
            >
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
        </div>

        {users?.map((item) => (
          <div key={item._id}>
            {item._id !== id && (
              <div
                className="flex items-center bg-white dark:bg-[#29292a] shadow-md gap-2 rounded-md m-1 h-15 p-1 cursor-pointer"
                onClick={() => handleUser(item)}
              >
                <img
                  src={item.profilePicture}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-2">
                  <div className="font-semibold">{item.username}</div>
                  <div className="text-sm">Mở tin nhắn</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {currentChatUser ? (
        <ChatContainer currentChatUser={currentChatUser} className="" />
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <h1 className="text-xl">Mở tin nhắn</h1>
        </div>
      )}
    </div>
  );
};

export default Contact;
