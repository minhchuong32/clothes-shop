import orderModel from "../models/orderModel.js";
import Stripe from "stripe";
import userModel from "../models/userModel.js";
import axios from "axios";
import crypto from "crypto";

// global variables
const currency = "inr"; // default currency for stripe
const deliveryCharge = 10; // default delivery charge

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod,
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

// placing order using stripe method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.status(200).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {}
};

// verify stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log("Error verifying payment:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error: " + error.message,
      });
  }
};

// all orders data for admin panel
const placeOrderRazorpay = async (req, res) => {};

// user order data for frontend
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

// user order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

// updare order status for admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Internal server error: " + error.message });
  }
};

// cancel order for user
const cancelOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền hủy đơn hàng này" });
    }

    if (order.status === "Delivered" || order.status === "Shipped" || order.status === "Out for delivery") {
      return res.status(400).json({ success: false, message: "Đơn hàng đang giao hoặc đã giao thành công, không thể hủy" });
    }

    if (order.status === "Cancelled" || order.status === "Đã hủy") {
      return res.status(400).json({ success: false, message: "Đơn hàng đã được hủy trước đó" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });
    res.json({ success: true, message: "Hủy đơn hàng thành công" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, message: "Internal server error: " + error.message });
  }
};

// delete order for admin panel
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Xóa đơn hàng thành công" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Internal server error: " + error.message });
  }
};

export {
  placeOrder,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  cancelOrder,
  deleteOrder,
};
