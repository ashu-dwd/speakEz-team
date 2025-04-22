import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./components/pages/Home";
import Helpdesk from "./components/pages/Helpdesk";
import About from "./components/pages/About";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Forgotpassword from "./components/pages/Forgot-password";
import Dashboard from "./components/pages/Dashboard";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar";
import Practicewithai from "./components/pages/Practice";
import Morecourse from "./components/Morecourse/Morecourse";
import Coursedetail from "./components/Coursedetails/Coursedetails";
import Vocabulary from "./components/pages/Vocabulary";
import Contact from "./components/pages/Contact";
import Developer from "./components/Developer/Developer";
import Blog from "./components/Blog/Blog";
import BlogDetails from "./components/Blog/BlogDetails";
import Aicharacter from "./components/Aicharacter/Aicharacter";
import Verifyotp from "./components/pages/Verifyotp";
import Payment from "./components/Payment/Payment";
import ResetPassword from "./components/Resetpassword/Resetpassword";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const App = () => {
  const isAdmin = localStorage.getItem("role") === "admin";

  return (
    <>
      <ScrollToTop />
      <Navbar isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/help" element={<Helpdesk />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-otp" element={<Verifyotp />} />
        <Route path="/practicewithai" element={<Practicewithai />} />
        <Route path="/Morecourse" element={<Morecourse />} />
        <Route path="/course/:courseId" element={<Coursedetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/aicharacter" element={<Aicharacter isAdmin={true} />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
