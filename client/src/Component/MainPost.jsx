import React, { useState, useEffect } from "react";
import axios from "axios";
// import Post from "./Post.jsx";
import { useSelector } from "react-redux";
import ContentPost from "./ContentPost.jsx";
import Post from "./Post.jsx";

const MainPost = () => {
  const [post, setPost] = useState([]);

  const [renderPost, setRenderPost] = useState(false);
  //Lấy người dùng hiện tại
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  let user = currentUser?.user;

  const id = user?._id;

  console.log();

  const getPost = async () => {
    try {
      const { data } = await axios.get(`/api/user/follow/${id}`);
      setPost(data.post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderPost]);

  console.log(post);
  return (
    <div className="flex-1">
      <ContentPost setRenderPost={setRenderPost} />
      {post.map((item, index) => (
        <Post post={item} key={index} setRenderPost={setRenderPost} />
      ))}
    </div>
  );
};

export default MainPost;
