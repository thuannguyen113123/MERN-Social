import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AiOutlineLike,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineDelete,
} from "react-icons/ai";

import { TiThumbsUp } from "react-icons/ti";

import ProfileImage from "../Images/WIN_20230918_16_20_02_Pro.jpg";
import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";

const ProfilePost = ({ detail }) => {
  const [comments, setComments] = useState([]);
  const [commentwriting, setCommentwriting] = useState("");

  //Hiển thị khung bình luận
  const [show, setShow] = useState(false);

  const [user, setUser] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  let users = currentUser?.user;
  const userId = users._id;

  const getUser = async () => {
    try {
      const { data } = await axios.get(
        `/api/user/post/user-details/${detail.user}`
      );
      setUser(data.others);
    } catch (error) {
      console.log(error);
      //   toast.error("Xảy ra lỗi khi nhận dữ liệu");
    }
  };
  useEffect(() => {
    getUser();
  }, [detail.user]);
  const [like, setLike] = useState(
    detail.like.includes(userId) ? (
      <AiOutlineLike className="text-[#1877F2] text-[22px]" />
    ) : (
      <AiOutlineLike className="text-[22px]" />
    )
  );
  const [count, setCount] = useState(detail.like.length);
  const handleLike = async () => {
    if (like.type === AiOutlineLike) {
      await axios.put(`/api/post/${detail._id}/like`);
      setLike(<TiThumbsUp className="text-[#1877F2] text-[22px]" />);
      setCount(count + 1);
    } else {
      await axios.put(`/api/post/${detail._id}/like`);
      setLike(<AiOutlineLike className="text-[22px]" />);
      setCount(count - 1);
    }
  };

  const addComment = async () => {
    const comment = {
      postid: `${detail._id}`,
      username: `${users.username}`,
      comment: `${commentwriting}`,
      profile: `${users?.profilePicture}`,
    };

    await axios.put(`/api/post/comment/post`, comment);

    setComments(comments.concat(comment));
    setCommentwriting("");
  };

  const handleComment = () => {
    addComment();
  };

  const handleShow = () => {
    if (show === false) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <div className="shadow-lg bg-white dark:bg-[#29292a] w-[95%] m-auto mt-5 rounded-md flex-1">
      <div>
        <div className="flex justify-between  items-center ml-[2px]">
          <div className="flex items-center ml-[2px]">
            {user.profilePicture === "" ? (
              <img
                alt=""
                className="w-10 h-10 rounded-full"
                src={`${ProfileImage}`}
              />
            ) : (
              <img
                alt=""
                className="w-10 h-10 rounded-full m-2"
                src={`${user.profilePicture}`}
              />
            )}
            <span className="ml-1">{user.username}</span>
          </div>
        </div>
        <p className="text-start m-[5px] text-[14px] ">{detail.title}</p>
        <div className="flex justify-center">
          {detail.image !== "" ? (
            <img
              alt=""
              src={`${detail.image}`}
              className="w-[500px] h-[450px] object-cover rounded-sm shadow-md"
            />
          ) : detail.video !== "" ? (
            <video
              controls
              className="w-[500px] h-[450px] rounded-sm shadow-md"
            >
              <source src={`${detail.video}`} type="video/mp4" />
            </video>
          ) : (
            ""
          )}
        </div>
        <div className="flex items-center justify-between m-[2px] py-2">
          <div className="flex items-center mr-[2px] cursor-pointer w-20">
            <Button
              onClick={handleLike}
              className="border-none text-black dark:text-white"
            >
              {like}
              <p className="whitespace-nowrap ml-[5px]">{count} Thích</p>
            </Button>
            <Button
              onClick={handleShow}
              className="flex items-center border-none text-black dark:text-white"
            >
              <AiOutlineComment className="text-[22px]" />
              <span className="whitespace-nowrap ml-[5px]">
                {comments.length} Bình Luận
              </span>
            </Button>
          </div>

          <div className="flex items-center mr-[5px] ml-[240px] cursor-pointer ">
            <Button className="flex items-center border-none text-black dark:text-white">
              <AiOutlineShareAlt className="text-[22px]" />
              <span className="whitespace-nowrap">Chia sẽ</span>
            </Button>
          </div>
        </div>

        {show === true ? (
          <div>
            <div className="flex items-center mr-[2px] px-2 py-2">
              <img
                alt=""
                src={`${users.profilePicture}`}
                className="w-10 h-10 rounded-full"
              />

              <TextInput
                onChange={(e) => setCommentwriting(e.target.value)}
                value={commentwriting}
                placeholder="Vui lòng viết bình luận"
                className="ml-[10px] w-[85%] h-full  border-[#000000] rounded-sm focus:border-[#1877F2]"
              />
              <Button
                className="bg-blue-500 ml-[5px] rounded-full hover:bg-blue-700"
                onClick={handleComment}
              >
                Gửi
              </Button>
            </div>

            {comments.map((item, index) => (
              <div className="flex items-center">
                <div className="flex items-center ml-[2px]" key={index}>
                  <img
                    alt=""
                    className="w-10 h-10 rounded-full"
                    src={`${item.profile}`}
                  />
                  <div
                    className="ml-[5px] mt-[30px]"
                    sx={{ ml: "5px", mt: "30px" }}
                  >
                    <h5>{item.username}</h5>

                    <span className="text-[14px] text-[#aaa]">
                      {item.comment}
                    </span>
                    <span className="text-[14px] text-[#aaa]">
                      <Button
                        className="text-[12px]  border-none hover:bg-gray-300"
                        // onClick={() => handleDeleteComment(post._id, item._id)}
                      >
                        <AiOutlineDelete className="text-[22px] mr-2 text-black dark:text-white" />
                        <span className="text-black dark:text-white">
                          thu hồi
                        </span>
                      </Button>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ProfilePost;
