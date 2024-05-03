import { Avatar, Button, Navbar } from "flowbite-react";
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  AiOutlineSearch,
  AiFillBell,
  AiOutlineCloseCircle,
  AiOutlineLoading,
} from "react-icons/ai";
import { Dropdown } from "flowbite-react";
import { FaMoon, FaSun, FaFacebookMessenger } from "react-icons/fa";
import { signoutSuccess } from "../redux/user/userSlide.js";
import { toggleTheme } from "../redux/theme/themeSlice.js";
import useDebounce from "../hooks/useDebounce.js";

const Header = () => {
  // Tạo này để nó acctive vào cái mình chọn trong toggle
  // const path = useLocation().pathname;

  const location = useLocation();
  const navigate = useNavigate();

  //tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  //Kết quả tìm kiếm
  const [searchResult, setSearchResult] = useState([]);

  const [showResult, setShowResult] = useState(true);

  const [loading, setLoading] = useState(false);

  //Lấy người dùng hiện tại
  const { currentUser } = useSelector((state) => state.user);
  const [listNotification, setListNotification] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  //Lấy trạng thái theme
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const inputRef = useRef();
  const debouncedValue = useDebounce(searchTerm, 500);

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

  // lấy người dùng để tìm kiếm
  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }
    setLoading(true);
    const getAllUser = async () => {
      try {
        const res = await axios.get(
          `/api/user/get-allUser?searchTerm=${encodeURIComponent(
            debouncedValue
          )}`
        );
        const data = res.data;
        if (!data.success) {
          console.log(data.message);
        } else {
          setSearchResult(data.users);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    getAllUser();
  }, [debouncedValue]);

  const getNotifications = async () => {
    try {
      const res = await axios.get(`/api/user/get-notifications`);
      const data = res.data;

      if (data.success) {
        setListNotification(data.notifications);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // //Tìm kiếm
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  //Xứ lý click ra ngoài thì ẩn bảng kết quả tìm kiếm
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra xem event.target có phải là phần tử mẹ hay không
      if (!event.target.closest(".relative")) {
        setShowResult(false); // Ẩn thông báo khi click ra ngoài
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  console.log(searchResult);

  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchTerm(searchValue);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResult([]);
    inputRef.current.focus();
  };
  return (
    <Navbar className="py-2 w-full px-40 mx-auto justify-between shadow-md dark:bg-[#30323a] border-b-2">
      {/* co giản cở chử theo kích thước web text-sm sm:text-xl */}
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full text-white">
          Thuận's
        </span>
        Social
      </Link>
      <form onSubmit={handleSubmit} className="w-[450px] mx-auto relative">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          tìm kiếm
        </label>
        <div className="relative hidden lg:block">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Nhập để tìm kiếm"
            spellCheck="false"
            ref={inputRef}
            onChange={handleChange}
            value={searchTerm}
            onFocus={() => setShowResult(true)}
            required
          />

          <div className="text-black absolute end-0.5 bottom-[4px]  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 right-[100px]">
            {!!searchTerm && !loading && (
              <button onClick={handleClear}>
                <AiOutlineCloseCircle className="text-[18px] hover:scale-110" />
              </button>
            )}

            {loading && (
              <button className="animate-spin">
                <AiOutlineLoading className="text-[18px]" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Tìm kiếm
          </button>
        </div>
        {/* Trả kết quả và hiển thị khi có kết quả tìm kiếm */}
        {showResult && searchResult.length > 0 && (
          <div className="bg-white dark:bg-gray-700 absolute top-16   z-50 w-full">
            <div className="relative p-6 bg-inherit rounded-xl shadow-xl w-full iner">
              <h2 className="font-bold my-2">Tài khoản</h2>
              {searchResult.map((result) => (
                <div key={result.id}>
                  <div className="flex flex-1 items-center mx-2 gap-2 hover:bg-gray-200 dark:hover:bg-slate-700 ">
                    <img
                      alt={result.profilePicture}
                      src={result.profilePicture}
                      className="w-10 h-10 mt-2 rounded-full"
                    />
                    <Link to={`/Profile/${result._id}`}>
                      <span>{result.username}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
      {/* Giao diện web thì ẩn dt thì hiện pill thuộc tín làm nút như viên thuốc*/}
      <Link to="/search">
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch />
        </Button>
      </Link>
      <div className="flex items-center gap-2 md:order-2">
        <div className="group relative">
          <Button
            pill
            className="w-12 h-10 hidden sm:inline relative cursor-default"
            color="gray"
            // onClick={() => dispatch(toggleTheme())}
          >
            {listNotification.length > 0 && (
              <>
                <div className="absolute top-[2px] right-[2px] bg-red-500 text-white rounded-full w-[16px] h-[16px] text-[12px] flex items-center justify-center">
                  {listNotification.length}
                </div>
              </>
            )}
            <AiFillBell className="dark:text-black hover:scale-110" />
            <div className="bg-white dark:bg-gray-700 absolute top-5 left-[-250%] transition transform translate-y-0 opacity-0 invisible group-hover:translate-y-5 group-hover:opacity-100 group-hover:visible duration-500 ease-in-out z-50 min-w-[300px]">
              <div className="relative p-6 bg-inherit rounded-xl shadow-xl w-full iner">
                <h2 className="text-center font-bold my-2">Thông báo</h2>
                {listNotification &&
                  listNotification.map((notification, index) => (
                    <div className="flex items-center" key={index}>
                      <img
                        alt=""
                        src={notification?.senderId.profilePicture}
                        className="rounded-full object-cover w-10 h-10 "
                      />
                      <p className="ml-[5px]  text-[13px] text-start w-[120px]">
                        {notification?.message}
                      </p>
                      {notification?.postId?.image !== "" ? (
                        <img
                          src={notification?.postId?.image}
                          alt=""
                          className="w-[35px] h-[35px] ml-10"
                        />
                      ) : (
                        <video className="w-[35px] h-[35px] ml-10">
                          <source
                            src={notification?.postId.video}
                            type="video/mp4"
                          />
                        </video>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </Button>
        </div>
        <Link to="/chat">
          <Button
            pill
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            // onClick={() => dispatch(toggleTheme())}
          >
            <FaFacebookMessenger className="dark:text-black hover:scale-110" />
          </Button>
        </Link>

        <Button
          pill
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <FaMoon className="hover:scale-110" />
          ) : (
            <FaSun className="dark:text-black hover:scale-110" />
          )}
        </Button>
        {currentUser?.user ? (
          <Dropdown
            className="dark:bg-[#30323a]"
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                className="w-12 h-12"
                img={currentUser.user?.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                @{currentUser.user?.username}
              </span>
              <span className="block text-sm font-medium truncate">
                {currentUser.user?.email}
              </span>
            </Dropdown.Header>
            <Link to={`/Profile/${currentUser.user._id}`}>
              <Dropdown.Item>Trang cá nhân</Dropdown.Item>
            </Link>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Thông Tin</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Đăng Xuất</Dropdown.Item>
          </Dropdown>
        ) : (
          <>
            <Link to="/sign-in">
              <Button
                type="submit"
                className="transition-all block py-1 px-4 w-full text-black dark:text-white font-bold rounded-xl cursor-pointer  hover:from-indigo-700 hover:to-purple-500  transform hover:-translate-y-1 hover:shadow-lg justify-center"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button
                type="submit"
                className="transition-all block py-1 px-4 w-full text-white font-bold rounded-xl cursor-pointer bg-black hover:from-indigo-700 hover:to-purple-500  transform hover:-translate-y-1 hover:shadow-lg justify-center"
              >
                Đăng ký
              </Button>
            </Link>
          </>
        )}
      </div>
    </Navbar>
  );
};

export default Header;
