import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../Component/DashProfile";

import Header from "./../Component/Header";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  //khi thay đổi trên thanh địa chỉ url sẽ render lại
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col md:flex-row max-w-6xl mx-auto">
        {/* Profile */}
        {tab === "profile" && <DashProfile />}
      </div>
    </>
  );
};

export default Dashboard;
