import { Alert, Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlide.js";
import OAuth from "./../Component/OAuth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  const { error: errorMessage } = useSelector((state) => state.user);

  // hàm xử lý khi nhấn đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      return dispatch(signInFailure("Vui lòng không để trống"));
    }
    try {
      dispatch(signInStart());
      const res = await axios.post(`/api/auth/login`, {
        email,
        password,
      });

      const data = res.data;
      if (!data.success) {
        dispatch(signInFailure(data.message));
      }
      if (data.success) {
        dispatch(signInSuccess(data));

        navigate(location.state || "/");
      }
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center">
      <div className="border-t-8 rounded-md border-indigo-600 bg-white p-12 shadow-2xl w-96">
        <h1 className="font-bold text-center block text-2xl">Log In</h1>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <Label value="Email" />
            <TextInput
              type="email"
              placeholder="me@example.com"
              className="rounded-lg"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label value="Password" />
            <TextInput
              type="password"
              placeholder="••••••••••"
              className="rounded-lg"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <Button
              type="submit"
              className="flex mt-6 transition-all py-1 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-400 hover:from-indigo-700 hover:to-purple-500 focus:bg-indigo-900 transform hover:-translate-y-1 hover:shadow-lg justify-center"
            >
              Đăng nhập
            </Button>
            <OAuth />
          </div>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Bạn chưa có tài khoản? </span>
          <Link to="/sign-up" className="text-blue-500">
            Đăng ký
          </Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5 text-[#ff0000]">{errorMessage}</Alert>
        )}
      </div>
    </div>
  );
};

export default SignIn;
