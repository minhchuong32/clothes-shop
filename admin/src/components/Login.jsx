import { React, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault(); // giữ lại để không reload trang
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Đăng nhập không thành công. Vui lòng thử lại. " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-4">Trang quản trị</h1>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4" autoComplete="on">
          <div className="mb-2 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Địa chỉ email</p>
            <input
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="email"
              placeholder="nhap@email.com"
              required
            />
          </div>

          <div className="mb-2 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Mật khẩu</p>
            <input
              name="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="password"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white cursor-pointer bg-black hover:bg-gray-800 transition-all duration-500"
            type="submit"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
