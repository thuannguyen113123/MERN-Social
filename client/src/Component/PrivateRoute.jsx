import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

//cho phép React Router render nội dung của route con trong vị trí mà nó được đặt. outlet
const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser?.user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
