import React from "react";
import Header from "../Component/Header";
import Leftbar from "../Component/Leftbar";
import MainPost from "../Component/MainPost";
import Rightbar from "../Component/Rightbar/Rightbar";

const Home = () => {
  return (
    <>
      <Header />
      <div className="w-full max-w-6xl mx-auto min-h-screen mt-2 flex justify-between">
        <Leftbar />
        <MainPost />
        <Rightbar />
      </div>
    </>
  );
};

export default Home;
