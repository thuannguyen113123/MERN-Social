import React, { useState, useEffect, useRef } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase.js";
import axios from "axios";
import { Button, TextInput, Alert } from "flowbite-react";
import { useParams } from "react-router";
import Header from "./../Component/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdatePost = () => {
  const filePickerRef = useRef();
  const { pId } = useParams();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const [imagePre, setImagePre] = useState(null);
  const [videoPre, setVideoPre] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [post, setPost] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/post/getDetailPost/${pId}`);
        const data = await res.data;
        if (data.success) {
          const { title, image, video } = data.postDetail;
          setTitle(title);
          setPost(data.postDetail);
          setImagePre(image);
          setVideoPre(video);
        } else {
          setUploadError(data.message);
        }
      } catch (error) {
        setUploadError(error.message);
      }
    };

    fetchPost();
  }, [pId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type.split("/")[0];
      if (fileType === "image") {
        setFile(selectedFile);
        setImagePre(URL.createObjectURL(selectedFile));
      } else if (fileType === "video") {
        setVideo(selectedFile);
        setVideoPre(URL.createObjectURL(selectedFile));
      }
    }
  };

  const uploadFile = async (file) => {
    try {
      const fileName = new Date().getTime() + file?.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          setUploadError("Lỗi khi tải lên không thành công: " + error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const updatedData = {
            ...post,
            image: file ? downloadURL : post.image,
            video: video ? downloadURL : post.video,
          };
          setPost(updatedData);
          setUploadProgress(0);
          updatePost(updatedData);
        }
      );
    } catch (error) {
      setUploadError("Lỗi khi tải lên không thành công: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      await uploadFile(file);
    } else if (video) {
      await uploadFile(video);
    } else {
      updatePost({ ...post, title });
    }
  };

  const updatePost = async (postData) => {
    try {
      const response = await axios.put(`/api/post/update-post/${post._id}`, {
        postData,
      });
      if (response.data.success) {
        console.log(response.data);
        navigate("/");
      } else {
        setUploadError("Có lỗi khi cập nhật bài viết");
        toast.error("Xảy ra lỗi khi cập nhật bài viết");
      }
    } catch (error) {
      setUploadError(
        "Lỗi trong quá trình gửi yêu cầu cập nhật: " + error.message
      );
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto my-10 w-full bg-white dark:bg-[#2a2a2b] shadow-md">
        <h1 className="text-center my-5 font-bold ">Cập nhật bài viết</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 ">
          <div className="w-[100%] flex justify-start items-center mx-auto gap-2">
            <label htmlFor="title">Bài viết:</label>
            <TextInput
              type="text"
              placeholder="Tiêu đề bài viết."
              id="title"
              className="w-[50%]"
              style={{ color: "black" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex justify-start items-center gap-2">
            <input
              type="file"
              name="file"
              id="file"
              ref={filePickerRef}
              className="hidden"
              onChange={handleFileChange}
            />
            {imagePre && (
              <div
                className="relative w-[400px] h-[200px] self-center overflow-hidden cursor-pointer rounded-md shadow-md flex items-center gap-2"
                onClick={() => filePickerRef.current.click()}
              >
                <label htmlFor="file">Ảnh:</label>
                {uploadProgress > 0 && (
                  <CircularProgressbar
                    value={uploadProgress}
                    text={`${uploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      },
                    }}
                  />
                )}
                <img
                  src={imagePre}
                  alt="Selected"
                  className={`rounded-md w-full h-full object-cover border-8 border-[lightgray] ${
                    uploadProgress && uploadProgress < 100 && "opacity-60"
                  }`}
                />
              </div>
            )}
            {uploadError && <Alert color="failure">{uploadError}</Alert>}
          </div>
          <div className="flex justify-start items-center gap-2">
            <input
              type="file"
              name="video"
              id="video"
              ref={filePickerRef}
              className="hidden"
              onChange={handleFileChange}
            />
            {videoPre && (
              <div
                className="relative w-[400px] h-[200px] self-center overflow-hidden cursor-pointer rounded-md shadow-md flex items-center gap-2"
                onClick={() => filePickerRef.current.click()}
              >
                <label htmlFor="video">Video:</label>
                {uploadProgress > 0 && (
                  <CircularProgressbar
                    value={uploadProgress}
                    text={`${uploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      },
                    }}
                  />
                )}
                <video
                  src={videoPre}
                  className={`rounded-md w-full h-full object-cover border-8 border-[lightgray] ${
                    uploadProgress && uploadProgress < 100 && "opacity-60"
                  }`}
                  controls
                  style={{ marginTop: "10px" }}
                >
                  <source src={videoPre} type="video/mp4" />
                </video>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-4 my-2">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 px-4"
            >
              Xác nhận
            </Button>
            <Button
              // onClick={() => onClose()}
              className="mt-[2px] text-inherit px-8 hover:bg-slate-300 "
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdatePost;
