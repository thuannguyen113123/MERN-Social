import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { app } from "../firebase";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlide";

const DashProfile = () => {
  const { currentUser, error } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);

  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  //Modal xóa tài khoản
  const [showModal, setShowModal] = useState(false);
  //dữ liệu gữi về server
  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();

  //Dùng useref để tham chiếu đến ô in put khi mình click vào div
  const filePickerRef = useRef();

  axios.defaults.withCredentials = true;

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    console.log("tải ảnh");
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Lỗi tải ảnh (tệp phải nhỏ hơn 2mb)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileURL(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    // kiểm tra xem có thay đổi gì không
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Không có thay đổi trường nào khi nhấn cập nhật");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Vui lòng chờ ảnh tải lên.");
      return;
    }
    try {
      dispatch(updateStart());

      const res = await axios.put(
        `/api/user/update/${currentUser.user._id}`,
        formData
      );
      const data = res.data;
      if (!data.success) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
      if (data.success) {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Cập nhật xong.");
      }
    } catch (error) {
      dispatch(updateFailure("Đã xảy ra lỗi khi cập nhật thông tin cá nhân."));
      setUpdateUserError(error.messager);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);

    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(
        `/api/user/delete/${currentUser.user._id}`
      );
      const data = await res.data;
      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        //navigate("/sign-in");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
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
    <div className="max-w-lg mx-auto w-full p-3 bg-white shadow-md dark:bg-[#29292a] my-2">
      <h1 className="my-7 text-center font-semibold text-3xl">
        Thông tin cá nhân
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeImage}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center overflow-hidden cursor-pointer rounded-full shadow-md"
          onClick={() => {
            filePickerRef.current.click();
          }}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rbg(62,152,199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileURL || currentUser.user?.profilePicture}
            alt="User"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Tên người dùng"
          defaultValue={currentUser.user?.username}
          onChange={handleChange}
          style={{ color: "black" }}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.user?.email}
          onChange={handleChange}
          style={{ color: "black" }}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          //defaultValue={currentUser.user.username}
        />

        <TextInput
          type="number"
          id="phone"
          placeholder="Số điện thoại"
          defaultValue={currentUser.user?.phone}
          onChange={handleChange}
          style={{ color: "black" }}
        />
        <Button
          type="submit"
          className="w-full text-white bg-blue-500 hover:bg-blue-700"
        >
          Cập nhật
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Xóa tài khoản
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Đăng xuất
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-12 h-12 text-gray-400 dark:text-gray-200 mx-auto mb-5" />
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-5">
              Bạn có chắc muồn xóa tài khoản
            </h3>
            <div className="flex justify-center gap-6">
              <Button color="failure" onClick={handleDeleteUser}>
                Vâng, xóa
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Không, hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
