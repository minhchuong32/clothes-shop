import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setToken('');
    setShowConfirm(false);
  };

  return (
    <div className="flex items-center justify-between py-2 px-[4%] shadow-sm border-b relative">
      <img className="w-[max(20%,100px)]" src={assets.logo} alt="Logo" />
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-gray-800 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-black transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
      >
        Đăng xuất
      </button>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 transform transition-all animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Xác nhận đăng xuất</h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản quản trị không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition cursor-pointer shadow-md"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
