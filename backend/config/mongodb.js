import mongoose from "mongoose";
import dns from "dns";

// Force DNS servers to resolve MongoDB SRV records properly on Windows
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB Error:", err);
    }
};

export default connectDB;