import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import OAuth from "../Component/OAuth";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      return setErrorMessage("Vui lòng nhập tất cả các trường");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await axios.post(`http://localhost:8080/api/auth/register`, {
        name,
        email,
        password,
        phone,
      });

      const data = res.data;
      if (!data.success) {
        return setErrorMessage(data.message);
      }
      navigate("/sign-in");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center">
      <div className="border-t-8 rounded-md border-indigo-600 bg-white p-10 shadow-2xl w-96">
        <h1 className="font-bold text-center block text-2xl">Sign Up</h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <Label value="Tên người dùng" />
            <TextInput
              type="text"
              placeholder="Tên người dùng"
              className="rounded-lg"
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label value="Email" />
            <TextInput
              type="email"
              placeholder="Email"
              className="rounded-lg"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label value="Mật Khẩu" />
            <TextInput
              type="password"
              placeholder="Mật khẩu"
              className="rounded-lg"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label value="Số điện thoại" />
            <TextInput
              type="number"
              placeholder="Nhập số điện thoại"
              id="phone"
              className="rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button
            className="flex mt-6 transition-all py-1 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-400 hover:from-indigo-700 hover:to-purple-500 focus:bg-indigo-900 transform hover:-translate-y-1 hover:shadow-lg justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" /> <span>Đang tải....</span>
              </>
            ) : (
              "Đăng ký"
            )}
          </Button>
          <OAuth />
        </form>

        <div className="flex gap-2 text-sm mt-5">
          <span>Bạn đã có tài khoản? </span>
          <Link to="/sign-in" className="text-blue-500">
            Đăng nhập
          </Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5 text-[#ff0000]">{errorMessage}</Alert>
        )}
      </div>
    </div>
  );
};

export default SignUp;
