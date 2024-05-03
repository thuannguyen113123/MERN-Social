import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ScrollToTop from "./Component/ScrollToTop";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import PrivateRoute from "./Component/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import UpdatePost from "./pages/UpdatePost";
import Search from "./pages/Search";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<Home />} />

          <Route path="/Profile/:id" element={<Profile />} />
          <Route path="/updatePost/:pId" element={<UpdatePost />} />

          <Route path="/chat" element={<Chat />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
