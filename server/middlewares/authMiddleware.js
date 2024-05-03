import JWT from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const requireSignIn = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, "Lỗi truy cập: Không tìm thấy token"));
  }
  JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Lỗi truy cập: Token không hợp lệ"));
    }
    req.user = user;
    next();
  });
};
