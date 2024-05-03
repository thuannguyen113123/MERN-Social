import React from "react";
import ProfileLeftbar from "../Component/ProfileLeftbar";
import ProfileRightbar from "../Component/ProfileRightbar";
import ProfileMainPost from "../Component/ProfileMainPost";
import { useSelector } from "react-redux";
import Header from "./../Component/Header";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  let user = currentUser.user;
  console.log(user);
  return (
    <>
      <Header />
      <div className="w-full max-w-6xl mx-auto min-h-screen mt-2 flex justify-between">
        <ProfileLeftbar />
        <ProfileMainPost />
        <ProfileRightbar />
      </div>
    </>
  );
};

export default Profile;
