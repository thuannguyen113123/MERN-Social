import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlide";
import { useDispatch } from "react-redux";
import axios from "axios";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const dispatch = useDispatch();

  //khi thay đổi trên thanh địa chỉ url sẽ render lại
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  //Đăng xuất
  const handleSignOut = async () => {
    try {
      const res = await axios.post("/api/user/signout");
      const data = await res.data;
      if (!data.success) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full my-2">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              labelColor="dark"
              as="div"
              className="cursor-pointer bg-white shadow-md dark:bg-[#29292a]"
            >
              Thông tin cá nhân
            </Sidebar.Item>
          </Link>

          <Sidebar.Item
            onClick={handleSignOut}
            icon={HiArrowSmRight}
            className="cursor-pointer bg-white shadow-md dark:bg-[#29292a]"
          >
            Đăng xuất
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
