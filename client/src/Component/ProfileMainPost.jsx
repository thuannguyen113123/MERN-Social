import React, { useState, useEffect } from "react";

import ContentPost from "./ContentPost";

import axios from "axios";
import { useParams } from "react-router";
import ProfilePost from "./PofilePost/ProfilePost";

const ProfileMainPost = () => {
  //Tham số hai là lấy id
  const { id } = useParams();
  const [post, setPost] = useState([]);

  const getProfilePost = async () => {
    try {
      const { data } = await axios.get(`/api/post/get-post/${id}`);
      console.log(data);
      setPost(data.myPost);
    } catch (error) {
      console.log(error);
      //   toast.error("Xảy ra lỗi khi nhận dữ liệu");
    }
  };
  useEffect(() => {
    getProfilePost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div className="w-[95%] mt-[10px]">
      <div className="relative">
        <img
          alt=""
          src={
            post[0]?.image ||
            "https://tse4.mm.bing.net/th?id=OIP.Pw9nEeFaAB8LhHt_cGihqgHaEc&pid=Api&P=0&h=180"
          }
          className="w-[95%] rounded-sm h-[20vh] object-cover m-[10px]"
        />
        <h3 className="absolute bottom-[5px] left-[15px] font-bold">
          Trang của bạn
        </h3>
      </div>
      <ContentPost />
      {post.map((item) => (
        <ProfilePost key={item._id} detail={item} />
      ))}
    </div>
  );
};

export default ProfileMainPost;
