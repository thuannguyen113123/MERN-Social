import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AiOutlineLike,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineDelete,
} from "react-icons/ai";
import { RiMoreLine } from "react-icons/ri";
import { TiThumbsUp } from "react-icons/ti";
import ProfileImage from "./Images/WIN_20230918_16_20_02_Pro.jpg";
import { useSelector } from "react-redux";

import { Button, TextInput, Modal } from "flowbite-react";
import { Link } from "react-router-dom";
import { ShareButton } from "./ShareButton";

const Post = ({ post, setRenderPost }) => {
  const { currentUser } = useSelector((state) => state.user);
  let users = currentUser?.user;
  const [user, setUser] = useState([]);

  //Phần Modal cập nhật bài viết
  const [visible, setVisible] = useState(false);

  const getUser = async () => {
    try {
      const { data } = await axios.get(
        `/api/user/post/user-details/${post.user}`
      );
      setUser(data.others);
    } catch (error) {
      console.log(error);
      //   toast.error("Xảy ra lỗi khi nhận dữ liệu");
    }
  };
  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.user]);

  const userId = users._id;

  const [like, setLike] = useState(
    post.like.includes(userId) ? (
      <AiOutlineLike className="text-[#1877F2] text-[22px] hover:scale-110" />
    ) : (
      <AiOutlineLike className="text-[22px] hover:scale-110" />
    )
  );
  const [count, setCount] = useState(post.like.length);

  const [comments, setComments] = useState(post.comments);
  const [commentwriting, setCommentwriting] = useState("");

  //Hiển thị khung bình luận
  const [show, setShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    if (like.type === AiOutlineLike) {
      await axios.put(`/api/post/${post._id}/like`);
      setLike(
        <TiThumbsUp className="text-[#1877F2] text-[22px] hover:scale-110" />
      );
      setCount(count + 1);
    } else {
      await axios.put(`/api/post/${post._id}/like`);
      setLike(<AiOutlineLike className="text-[22px] hover:scale-110" />);
      setCount(count - 1);
    }
  };

  const addComment = async () => {
    const comment = {
      postid: `${post._id}`,
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
  const deleteComment = async (postId, commentId) => {
    try {
      const res = await axios.delete(
        `/api/post/comment/delete/${postId}/${commentId}`
      );
      if (res.data.success) {
        // Cập nhật trạng thái bình luận sau khi xóa thành công
        setComments(comments.filter((comment) => comment._id !== commentId));
      } else {
        // Xử lý lỗi
        console.error("Xóa bình luận không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bình luận", error);
    }
  };

  // Ví dụ cách sử dụng:
  const handleDeleteComment = (postId, commentId) => {
    deleteComment(postId, commentId);
  };

  const deletePost = async () => {
    await axios.delete(`/api/post/delete-post/${post._id}`);
  };
  const handleDeletePost = () => {
    deletePost();
    setRenderPost((prev) => !prev);
  };

  const handleShow = () => {
    if (show === false) {
      setShow(true);
    } else {
      setShow(false);
    }
  };
  const handleShowMenu = () => {
    if (showMenu === false) {
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };

  // const formatMessageTime = (createdAt) => {
  //   const messageDate = new Date(createdAt);
  //   const currentDate = new Date();

  //   if (
  //     messageDate.getDate() === currentDate.getDate() &&
  //     messageDate.getMonth() === currentDate.getMonth() &&
  //     messageDate.getFullYear() === currentDate.getFullYear()
  //   ) {
  //     // Tin nhắn được tạo trong cùng một ngày, chỉ hiển thị thời gian
  //     return messageDate.toLocaleTimeString();
  //   } else {
  //     // Tin nhắn được tạo vào ngày khác, chỉ hiển thị ngày
  //     return messageDate.toLocaleDateString();
  //   }
  // };

  return (
    <>
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
              {/* <span className="ml-1"> {formatMessageTime(post.createdAt)}</span> */}
            </div>

            <div className="relative mr-2">
              <Button
                onClick={handleShowMenu}
                className="border-none outline-none"
              >
                <RiMoreLine className="text-[30px] text-black dark:text-white hover:scale-110" />
              </Button>
              {showMenu === true ? (
                <div className="w-[140px] absolute z-20 top-[30px] left-[-40px] bg-white dark:bg-[#2a2a2b] shadow-md">
                  {/* <Typography>Cập nhật</Typography> */}

                  <Link to={`/updatePost/${post._id}`}>
                    <div className="text-center  text-inherit cursor-pointer p-[5px] hover:shadow-md hover:bg-slate-100 dark:hover:bg-slate-600">
                      Chỉnh sữa bài viết
                    </div>
                  </Link>
                  <div className="border-b-2" />
                  <div
                    className="text-center w-full text-inherit cursor-pointer p-[5px]  hover:shadow-md hover:bg-slate-100 dark:hover:bg-slate-600"
                    onClick={handleDeletePost}
                  >
                    Xóa
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <p className="text-start m-[5px] text-[14px] ">{post.title}</p>
          <div className="flex justify-center">
            {post.image !== "" ? (
              <img
                alt=""
                src={`${post.image}`}
                className="w-[500px] h-[450px] object-cover rounded-sm shadow-md"
              />
            ) : post.video !== "" ? (
              <video
                controls
                className="w-[500px] h-[450px] rounded-sm shadow-md"
              >
                <source src={`${post.video}`} type="video/mp4" />
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
                <p className="whitespace-nowrap ml-[5px] ">{count} Thích</p>
              </Button>
              <Button
                onClick={handleShow}
                className="flex items-center border-none text-black dark:text-white"
              >
                <AiOutlineComment className="text-[22px] hover:scale-110" />
                <span className="whitespace-nowrap ml-[5px]">
                  {comments.length} Bình Luận
                </span>
              </Button>
            </div>

            <div className="flex items-center mr-[5px] ml-[240px] cursor-pointer ">
              <Button
                className="flex items-center border-none text-black dark:text-white"
                onClick={() => {
                  setVisible(true);
                }}
              >
                <AiOutlineShareAlt className="text-[22px] hover:scale-110" />
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
                          onClick={() =>
                            handleDeleteComment(post._id, item._id)
                          }
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

      {/* Modal cập nhật */}
      <Modal
        popup
        size="md"
        show={visible}
        onClose={() => setVisible(false)}
        className="z-30 max-w-[500px] mx-auto pt-32"
      >
        <Modal.Header />
        <h1 className="text-center font-bold">Chia sẽ bài viết</h1>
        <Modal.Body>
          <ShareButton
            url={encodeURI("http://localhost:3000/")}
            title={encodeURIComponent(post.title)}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Post;
