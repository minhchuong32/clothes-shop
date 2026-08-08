import { React, useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currrency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fecthAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {}
  };

  const statusHandler = async (event, orderId) => {
    if (!token) return null;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        await fecthAllOrders();
        toast.success("Đã cập nhật trạng thái đơn hàng");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật trạng thái đơn hàng thất bại");
    }
  };

  const deleteHandler = async (orderId) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này không?");
    if (!isConfirmed) return;

    if (!token) return null;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/delete",
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Đã xóa đơn hàng thành công");
        await fecthAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Xóa đơn hàng thất bại");
    }
  };

  useEffect(() => {
    fecthAllOrders();
  }, [token]);

  // Phân trang
  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [orders, itemsPerPage, totalPages, currentPage]);

  return (
    <div className="p-2 sm:p-4">
      {/* Top Header & Page Size Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Quản Lý Đơn Hàng</h3>
          <p className="text-xs text-gray-500 mt-1">
            Tổng cộng: <span className="font-semibold text-gray-800">{totalOrders}</span> đơn hàng
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <span>Hiển thị mỗi trang:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 outline-none font-medium cursor-pointer"
          >
            <option value={5}>5 đơn</option>
            <option value={10}>10 đơn</option>
            <option value={20}>20 đơn</option>
            <option value={50}>50 đơn</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed my-4">
          <p className="font-medium">Chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div>
          {currentOrders.map((order, index) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1.2fr] gap-4 items-start border border-gray-200 rounded-xl p-5 md:p-6 my-4 text-xs sm:text-sm text-gray-700 bg-white shadow-sm hover:shadow-md transition-all"
              key={index}
            >
              <img className="w-12" src={assets.parcel_icon} alt="Đơn hàng" />
              <div>
                <div>
                  {order.items.map((item, idx) => {
                    const itemText = `${item.name} x ${item.quantity} (${item.sizes})`;
                    return (
                      <p className="py-0.5 font-medium text-gray-800" key={idx}>
                        {itemText}
                        {idx !== order.items.length - 1 ? "," : ""}
                      </p>
                    );
                  })}
                </div>
                <p className="mb-1 font-bold text-gray-900 mt-3">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="text-gray-500 leading-tight">
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipcode}
                  </p>
                </div>
                <p className="mt-1 font-medium text-gray-600">SĐT: {order.address.phone}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Sản phẩm: {order.items.length}
                </p>
                <p className="mt-2 text-gray-600">Phương thức: <span className="font-medium">{order.paymentMethod}</span></p>
                <p className="text-gray-600">Thanh toán: <span className={`font-semibold ${order.payment ? "text-emerald-600" : "text-amber-600"}`}>{order.payment ? "Hoàn tất" : "Chờ thanh toán"}</span></p>
                <p className="text-gray-400 mt-1">Ngày: {new Date(order.date).toLocaleDateString("vi-VN")}</p>
              </div>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {currrency}
                {order.amount}
              </p>
              <div className="flex flex-col gap-2 w-full">
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className="p-2 font-semibold border rounded border-gray-300 outline-none cursor-pointer bg-gray-50 hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <option value="Đã đặt hàng">Đã đặt hàng</option>
                  <option value="Đang đóng gói">Đang đóng gói</option>
                  <option value="Đã gửi hàng">Đã gửi hàng</option>
                  <option value="Đang giao">Đang giao</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Cancelled">Đã hủy (Cancelled)</option>
                </select>

                <button
                  onClick={() => deleteHandler(order._id)}
                  className="mt-1 w-full py-1.5 px-3 border border-red-500 text-red-600 hover:bg-red-600 hover:text-white rounded font-medium transition cursor-pointer text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95"
                >
                   Xóa đơn hàng
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-6">
          <div className="text-xs text-gray-500">
            Trang <span className="font-bold text-gray-800">{currentPage}</span> / {totalPages}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border text-xs font-medium cursor-pointer transition ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
              }`}
            >
              Trang trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded text-xs font-bold cursor-pointer transition ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border text-xs font-medium cursor-pointer transition ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
              }`}
            >
              Trang sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
