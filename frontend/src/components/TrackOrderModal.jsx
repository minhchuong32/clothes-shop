import React from "react";

const STEPS = [
  { id: 1, key: "Đã đặt hàng", label: "Đã đặt hàng", desc: "Đơn hàng đã được tiếp nhận" },
  { id: 2, key: "Đang đóng gói", label: "Đang đóng gói", desc: "Đang kiểm tra & đóng gói sản phẩm" },
  { id: 3, key: "Đã gửi hàng", label: "Đã gửi hàng", desc: "Đã bàn giao cho đơn vị vận chuyển" },
  { id: 4, key: "Đang giao", label: "Đang giao hàng", desc: "Shipper đang trên đường giao tới bạn" },
  { id: 5, key: "Đã giao", label: "Đã hoàn thành", desc: "Đơn hàng đã giao thành công" },
];

const getStepIndex = (status) => {
  switch (status) {
    case "Đã đặt hàng":
    case "Order Placed":
      return 1;
    case "Đang đóng gói":
      return 2;
    case "Đã gửi hàng":
    case "Shipped":
      return 3;
    case "Đang giao":
    case "Out for delivery":
      return 4;
    case "Đã giao":
    case "Delivered":
      return 5;
    default:
      return 1;
  }
};

const TrackOrderModal = ({ order, currency, onClose, onRefresh }) => {
  if (!order) return null;

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "Cancelled" || order.status === "Đã hủy";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span>Theo dõi đơn hàng</span>
              <span className="text-xs bg-black text-white px-2.5 py-1 rounded-full font-medium">
                #{order.orderId ? order.orderId.slice(-6).toUpperCase() : ""}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Ngày đặt: {new Date(order.date).toLocaleString("vi-VN")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cancellation banner */}
        {isCancelled ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-700">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold">Đơn hàng này đã bị hủy</p>
              <p className="text-xs text-red-600">Đơn hàng đã được hủy thành công và không còn tiến trình giao hàng.</p>
            </div>
          </div>
        ) : (
          /* Timeline Progress Bar */
          <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-700">Tiến trình vận chuyển</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-pulse">
                ● {order.status}
              </span>
            </div>

            {/* Progress line & Steps */}
            <div className="relative my-6">
              {/* Progress Line background */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded"></div>
              {/* Active Progress Line */}
              <div
                className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 z-0 rounded transition-all duration-700"
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              ></div>

              {/* Step Circles */}
              <div className="flex justify-between relative z-10">
                {STEPS.map((step) => {
                  const isCompleted = currentStep >= step.id;
                  const isCurrent = currentStep === step.id;

                  return (
                    <div key={step.id} className="flex flex-col items-center group">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 shadow ${
                          isCurrent
                            ? "bg-black text-white ring-4 ring-black/20 scale-110"
                            : isCompleted
                            ? "bg-black text-white"
                            : "bg-white border-2 border-gray-300 text-gray-400"
                        }`}
                      >
                        {isCompleted ? "✓" : step.id}
                      </div>
                      <span
                        className={`text-[11px] sm:text-xs mt-2 text-center max-w-[70px] font-medium hidden sm:block ${
                          isCurrent
                            ? "text-black font-bold"
                            : isCompleted
                            ? "text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Step detail description */}
            <div className="mt-4 p-3 bg-white rounded-xl border border-gray-100 text-xs text-gray-600 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800">Trạng thái hiện tại: </span>
                <span>{STEPS.find((s) => s.id === currentStep)?.desc || order.status}</span>
              </div>
              <button
                onClick={onRefresh}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer ml-2"
              >
                Cập nhật 🔄
              </button>
            </div>
          </div>
        )}

        {/* Product item summary */}
        <div className="border rounded-xl p-4 mb-6 bg-white">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2">Chi tiết sản phẩm</h3>
          <div className="flex items-center gap-4">
            <img className="w-16 h-16 object-cover rounded-lg border" src={order.images?.[0]} alt={order.name} />
            <div className="flex-1 text-xs sm:text-sm">
              <p className="font-semibold text-gray-800">{order.name}</p>
              <p className="text-gray-500 mt-1">
                Kích cỡ: <span className="font-medium text-gray-700">{order.sizes}</span> | Số lượng:{" "}
                <span className="font-medium text-gray-700">{order.quantity}</span>
              </p>
              <p className="font-bold text-gray-900 mt-1">
                {currency} {order.price}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Address & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm border-t pt-4">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Phương thức thanh toán:</p>
            <p className="text-gray-600">{order.paymentMethod}</p>
            <p className="text-gray-500 text-xs mt-0.5">
              Thanh toán: <span className="font-medium">{order.payment ? "Đã thanh toán" : "Chờ thanh toán"}</span>
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Trạng thái đơn hàng:</p>
            <p className="font-bold text-emerald-600">{order.status}</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-black text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-800 transition cursor-pointer shadow-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;
