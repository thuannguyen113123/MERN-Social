import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Kết nối đến cơ sở dữ liệu Mongodb ${conn.connection.host}`);
  } catch (error) {
    console.log(`Lỗi kết nối cơ sở dữ liệu Mongodb ${error}`);
  }
};

export default connectDB;
