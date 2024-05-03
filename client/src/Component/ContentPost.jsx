import React, { useState } from "react";
import { IoIosImage } from "react-icons/io";
import { IoMdVideocam } from "react-icons/io";
import axios from "axios";
import { IoMdHappy } from "react-icons/io";
import { app } from "./../firebase.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { useSelector } from "react-redux";
import { TextInput, Button } from "flowbite-react";
import { toast } from "react-toastify";

const ContentPost = ({ setRenderPost }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [Video, setVideo] = useState(null);
  //Hiện ảnh video lên khi chọn
  const [imagePre, setImagePre] = useState(null);
  const [VideoPre, setVideoPre] = useState(null);

  const resetState = () => {
    setTitle("");
    setFile(null);
    setVideo(null);
    setImagePre(null);
    setVideoPre(null);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (file !== null) {
      const fileName = new Date().getTime() + file?.name;
      const storage = getStorage(app);
      const StorageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(StorageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Tải lên " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Tải lên bị tạm dừng");
              break;
            case "running":
              console.log("Đang tải lên");
              break;
            default:
              console.log("Trạng thái tải lên không xác định");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            axios
              .post(`/api/post/user/post`, {
                title: title,
                image: downloadURL,
                video: "",
              })
              .then((response) => {
                //   toast.success("Bài viết tải lên thành công");
                // window.location.reload(true);
                // Bài viết tải lên thành công, thực hiện reset state
                resetState();

                setRenderPost((prev) => !prev);
              })
              .catch((error) => {
                // Handle error
              });
          });
        }
      );
    } else if (Video !== null) {
      const fileName = new Date().getTime() + Video?.name;
      const storage = getStorage(app);
      const StorageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(StorageRef, Video);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Tải lên bị tạm dừng");
              break;
            case "running":
              console.log("Đang tải lên");
              break;
            default:
              console.log("Trạng thái tải lên không xác định");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            axios
              .post(`/api/post/user/post`, {
                title: title,
                video: downloadURL,
                image: "",
              })
              .then((response) => {
                //   toast.success("Bài viết tải lên thành công");
                // window.location.reload(true);
                // Bài viết tải lên thành công, thực hiện reset state
                resetState();

                setRenderPost((prev) => !prev);
              })
              .catch((error) => {
                // Handle error
              });
          });
        }
      );
    } else {
      axios
        .post(`/api/post/user/post`, {
          title: title,
          video: "",
          image: "",
        })
        .then((response) => {
          toast.success("Bài viết tải lên thành công");

          // Bài viết tải lên thành công, thực hiện reset state
          resetState();
          setRenderPost((prev) => !prev);
        })
        .catch((error) => {
          // Handle error
          toast.error("Tải bài viết thất bại");
        });
    }
  };

  return (
    <div className="shadow-lg bg-white dark:bg-[#29292a] w-[95%] m-auto mt-5 rounded-md flex-1">
      <div className="flex items-center p-2 gap-2">
        <img
          alt=""
          src={currentUser.user?.profilePicture}
          className="w-10 h-10 ml-2 rounded-full"
        />
        <TextInput
          type="text"
          placeholder="Viết cảm nghĩ của bạn vào đây."
          className="w-full border-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex justify-center">
        {imagePre !== null ? (
          <img
            alt=""
            src={imagePre}
            className="w-[400px] h-[250px] object-cover rounded-1"
          />
        ) : VideoPre !== null ? (
          <video width="400" height="250" controls>
            <source src={VideoPre} type="video/mp4" />
          </video>
        ) : (
          ""
        )}
      </div>
      <div className="flex justify-between ml-2">
        <div className="flex items-center">
          <Button className="border-none">
            <label htmlFor="file">
              <IoIosImage className="ml-1 text-black dark:text-white text-[16px] font-bold" />
              <TextInput
                type="file"
                name="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => [
                  setFile(e.target.files[0]),
                  setImagePre(URL.createObjectURL(e.target.files[0])),
                ]}
              />
            </label>
          </Button>
          <Button className="border-none">
            <IoMdHappy className="mr-1 text-black dark:text-white text-[16px] font-bold" />
          </Button>
          <Button className="border-none">
            <label htmlFor="video">
              <IoMdVideocam className="mr-1 text-black dark:text-white text-[16px] font-bold" />
              <TextInput
                type="file"
                name="video"
                id="video"
                style={{ display: "none" }}
                onChange={(e) => [
                  setVideo(e.target.files[0]),
                  setVideoPre(URL.createObjectURL(e.target.files[0])),
                ]}
              />
            </label>
          </Button>
        </div>
        <div className="p-2">
          <Button
            className="bg-blue-500 hover:bg-blue-700 rounded-full p-1 border-none"
            onClick={handlePost}
          >
            Đăng Bài
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentPost;
