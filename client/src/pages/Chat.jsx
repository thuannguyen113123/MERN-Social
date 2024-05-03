import React from "react";
import Contact from "../Component/Chat/Contact";

// import ChatContainer from "../Component/ChatContainer";
import Header from "../Component/Header";

const Chat = () => {
  return (
    <>
      <Header />
      <div sx={{ display: "flex" }}>
        <Contact />
        {/* <ChatContainer /> */}
      </div>
    </>
  );
};

export default Chat;
