import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import axios from "axios";
import Header from "./../Component/Header";
import { useSelector } from "react-redux";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const getUsers = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await axios.get(`/api/user/get-alluser?${searchQuery}`);
      const data = res.data;
      if (!data.success) {
        setLoading(false);
        return;
      }
      if (data.success) {
        setUsers(data.users);

        setLoading(false);
        if (data.users.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    getUsers();
  }, [location.search]);

  const handleShowMore = async () => {
    const numberOfUsers = users.length;
    const startIndex = numberOfUsers;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await axios.get(
      `/api/user/get-alluser?searchTerm=${searchQuery}`
    );
    const data = res.data;
    if (!data.success) {
      return;
    }
    if (data.success) {
      setUsers([...users, ...data.users]);
      if (data.users.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row">
        {/* <div className="p-7 border-b md:border-r h-[100px]  border-gray-500 w-[30%] bg-white dark:bg-[#29292a] shadow-md">
          
        </div> */}
        <div className="w-full max-w-2xl my-6 bg-white mx-auto dark:bg-[#29292a] shadow-md rounded-md">
          <div className="p-7 flex flex-wrap gap-4">
            {!loading && users.length === 0 && (
              <p className="text-xl text-gray-500">Không tìm thấy kết quả.</p>
            )}
            {loading && <p className="text-xl text-gray-500">Đang tải...</p>}
            <div className="flex flex-col">
              <h1 className="text-2xl">Mọi người</h1>
              <h1 className="text-1xl font-semibold sm:border-b border-gray-500  mt-5 ">
                Kết quả trả về: {users.length}
              </h1>
            </div>

            <div className=" max-w-6xl mx-auto py-6  xl:w-[88%]">
              {/* <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"> */}
              {!loading &&
                users &&
                users.map((result) => (
                  <div key={result.id} className="mt-2">
                    <div className="flex flex-1 items-center mx-2 gap-2">
                      <img
                        alt={result.profilePicture}
                        src={result.profilePicture}
                        className="w-10 h-10 mt-2 rounded-full"
                      />
                      <div className="flex justify-between w-full items-center">
                        <div>
                          <Link
                            to={`/Profile/${result._id}`}
                            className="hover:underline"
                          >
                            <span>{result.username}</span>
                          </Link>
                          <div>
                            {currentUser.user.Following.includes(
                              result._id
                            ) && <span>Bạn bè - </span>}{" "}
                            <span>
                              {result.Followers.length} người Theo dõi
                            </span>{" "}
                          </div>
                        </div>
                        {currentUser.user.Following.includes(result._id) && (
                          <Link to="/chat">
                            <button className="bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white">
                              Nhắn tin
                            </button>
                          </Link>
                        )}{" "}
                      </div>
                    </div>
                  </div>
                ))}
              {/* </div> */}
            </div>
            {showMore && (
              <button
                onClick={handleShowMore}
                className="text-teal-500 text-lg hover:underline p-7 w-full"
              >
                Hiển thị thêm
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
