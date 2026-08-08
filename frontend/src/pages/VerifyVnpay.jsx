import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyVnpay = () => {
  const { navigate, setCartItems, token, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const verifyPayment = async () => {
    try {
      if (!token) return;

      const vnp_Params = {};
      for (const [key, value] of searchParams.entries()) {
        vnp_Params[key] = value;
      }

      const response = await axios.post(
        backendUrl + "/api/order/verifyVnpay",
        { vnp_Params },
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        toast.success(response.data.message || "Thanh toán VNPay thành công!");
        navigate("/orders");
      } else {
        toast.error(response.data.message || "Thanh toán thất bại!");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error verifying VNPay payment:", error);
      toast.error("Xác thực thanh toán thất bại");
      navigate("/cart");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 text-lg font-medium">Đang xác thực thanh toán VNPay...</p>
    </div>
  );
};

export default VerifyVnpay;
