import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets, products } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("COD");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // Update the formData state with the new value
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!token) {
      toast.error("Vui lòng đăng nhập để thực hiện đặt hàng");
      navigate("/login");
      return;
    }
    try {
      let orderItem = [];
      if (Object.keys(cartItems).length === 0) {
        toast.error("Giỏ hàng của bạn đang trống");
        return;
      }
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const itemInfo = structuredClone(
            products.find((product) => product._id === productId)
          );
          if (itemInfo) {
            itemInfo.sizes = size;
            itemInfo.quantity = cartItems[productId][size];
            orderItem.push(itemInfo);
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItem,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method,
      };

      switch (method) {
        // api calls for cod
        case "COD":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            {
              headers: { token },
            }
          );
          console.log(response.data);
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
            toast.success("Đặt hàng thành công");
          } else {
            if (response.data.message === "Not Authorized Login Again") {
              toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
              navigate("/login");
            } else {
              toast.error("Đặt hàng thất bại: " + response.data.message);
            }
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi đặt hàng: " + error.message);
    }
  };




  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-4 min-h-[8-vh] border-t"
    >
      {/* Bên trái - Thông tin giao hàng */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"THÔNG TIN"} text2={"GIAO HÀNG"} />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            value={formData.firstName}
            name="firstName"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Họ"
          />
          <input
            required
            onChange={onChangeHandler}
            value={formData.lastName}
            name="lastName"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Tên"
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          value={formData.email}
          name="email"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Địa chỉ email"
        />

        <input
          required
          onChange={onChangeHandler}
          value={formData.street}
          name="street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Số nhà, tên đường"
        />

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            value={formData.city}
            name="city"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Thành phố"
          />
          <input
            required
            onChange={onChangeHandler}
            value={formData.state}
            name="state"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Tỉnh"
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            value={formData.zipcode}
            name="zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Mã bưu điện"
          />
          <input
            required
            onChange={onChangeHandler}
            value={formData.country}
            name="country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Quốc gia"
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          value={formData.phone}
          name="phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Số điện thoại"
        />
      </div>

      {/* Bên phải - Tổng đơn & phương thức thanh toán */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PHƯƠNG THỨC"} text2={"THANH TOÁN"} />

          <div className="flex gap-3 flex-col lg:flex-row">
            {/* Thanh toán khi nhận hàng */}
            <div
              onClick={() => setMethod("COD")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer rounded"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "COD" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                Thanh toán khi nhận hàng
              </p>
            </div>
          </div>

          <div className="w-full mt-8 text-end">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm hover:bg-gray-800 rounded"
            >
              ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
