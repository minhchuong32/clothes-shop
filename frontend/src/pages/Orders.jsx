import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify";
import axios from "axios";
import TrackOrderModal from "../components/TrackOrderModal";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) return null;
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        {
          headers: { token },
        }
      );
      console.log(response.data.orders);
      if (response.data.success) {
        let allOrderItems = [];
        response.data.orders.forEach((order) => {
          // Bỏ qua các đơn hàng đã bị hủy để không hiển thị trên giao diện người dùng
          if (order.status === "Cancelled" || order.status === "Đã hủy") return;

          order.items.forEach((item) => {
            item["orderId"] = order._id;
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrderItems.push(item);
          });
        });
        const updatedList = allOrderItems.reverse();
        setOrderData(updatedList);

        // Keep active tracked order synced if currently open
        if (selectedOrder) {
          const freshTrack = updatedList.find((i) => i.orderId === selectedOrder.orderId);
          if (freshTrack) setSelectedOrder(freshTrack);
        }
      } else {
        toast.error("Lỗi khi tải dữ liệu đơn hàng");
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu đơn hàng: " + error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
    if (!isConfirmed) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/cancel",
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Hủy đơn hàng thành công!");
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder(null);
        }
        loadOrderData();
      } else {
        toast.error(response.data.message || "Hủy đơn hàng thất bại");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Lỗi khi hủy đơn hàng: " + error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16 min-h-[60vh]">
      <div className="text-2xl">
        <Title text1={"ĐƠN HÀNG"} text2={"ĐÃ ĐẶT"} />
      </div>
      {orderData.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg">
          <p>Bạn chưa có đơn hàng nào đang xử lý.</p>
        </div>
      ) : (
        <div>
          {orderData.map((item, index) => {
            const canCancel = item.status !== "Delivered" && item.status !== "Shipped" && item.status !== "Out for delivery";

            return (
              <div key={index} className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-6 text-sm">
                  <img className="w-16 sm:w-20" src={item.images[0]} alt="" />
                  <div>
                    <p className="sm:text-base font-medium">{item.name}</p>
                    <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                      <p>
                        {currency} {item.price}
                      </p>
                      <p>Số lượng: {item.quantity}</p>
                      <p>Kích cỡ: {item.sizes}</p>
                    </div>
                    <p className="mt-2">
                       Ngày đặt hàng: 
                      <span className="text-gray-400">
                        {" "}
                       {new Date(item.date).toLocaleDateString("vi-VN")}
                      </span>
                    </p>
                    <p className="mt-2">
                      Phương thức:
                      <span className="text-gray-400">
                        {" "}
                        {item.paymentMethod}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <p className="min-w-2.5 h-2.5 rounded-full bg-green-500"></p>
                    <p className="text-sm md:text-base font-medium text-gray-700">
                      {item.status}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(item.orderId)}
                        className="border border-red-500 text-red-600 px-3 py-1.5 text-xs sm:text-sm font-medium rounded hover:bg-red-50 transition cursor-pointer"
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(item)}
                      className="border border-black bg-black text-white px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-800 cursor-pointer transition shadow-sm"
                    >
                      Theo dõi đơn hàng
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Theo Dõi Đơn Hàng */}
      {selectedOrder && (
        <TrackOrderModal
          order={selectedOrder}
          currency={currency}
          onClose={() => setSelectedOrder(null)}
          onRefresh={() => loadOrderData()}
        />
      )}
    </div>
  );
};

export default Orders;
