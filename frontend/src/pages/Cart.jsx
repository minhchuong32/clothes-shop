import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";

const Cart = () => {
  // Lấy thông tin từ context
  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);

  // Dữ liệu giỏ hàng hiển thị
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if(products.lenght === 0) return; // Nếu không có sản phẩm, không làm gì cả
    const tempData = [];
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        if (cartItems[items][size] <= 0) continue; // Bỏ qua nếu số lượng = 0

        tempData.push({
          _id: items,
          size: size,
          quantity: cartItems[items][size],
        });
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="text-2xl mb-3">
        <Title text1={"GIỎ"} text2={"HÀNG"} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          if (!productData) return null; // Nếu không tìm thấy sản phẩm, bỏ qua

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.images[0]}
                  alt="Sản phẩm"
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      Size: {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(item._id, item.size, Number(e.target.value))
                }
                type="number"
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 cursor-pointer sm:w-5"
                src={assets.bin_icon}
                alt="Xóa sản phẩm"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => {
                if (!token) {
                  toast.error("Vui lòng đăng nhập để tiến hành đặt hàng");
                  navigate('/login');
                } else {
                  navigate('/place-order');
                }
              }}
              className="mt-10 bg-black text-white py-2 px-4 rounded cursor-pointer hover:bg-gray-800 transition-all"
            >
              TIẾN HÀNH ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
