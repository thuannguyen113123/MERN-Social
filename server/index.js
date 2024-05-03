import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

//Cấu hình env(môi trường)
dotenv.config();

const app = express();
//Kết nối cơ sở dữ liệu
connectDB();

const __dirname = path.resolve();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(cookieParser());

//xứ lý đăng nhập
app.use("/api/auth", authRoutes);

//người dùng
app.use("/api/user", userRoutes);

// bài viết
app.use("/api/post", postRoutes);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server chạy trên port ${PORT}`);
});

global.onlinUsers = new Map();
io.on("connection", (socket) => {
  global.chatsocket = socket;

  socket.on("addUser", (id) => {
    global.onlinUsers.set(id, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlinUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
