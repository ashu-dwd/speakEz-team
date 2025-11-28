import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Helpdesk from "./pages/Helpdesk";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
//import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PracticeWithAi from "./pages/Practice";
import Morecourse from "./components/Morecourse";
import CourseDetail from "./components/Coursedetails";
import Vocabulary from "./pages/Vocabulary";
import Contact from "./pages/Contact";
import Developer from "./components/Developer";
import Blog from "./components/Blog";
import BlogDetails from "./components/BlogDetails";
import VerifyOtp from "./pages/VerifyOtp";
import Payment from "./components/Payment";
import ResetPassword from "./components/Resetpassword";
import VoiceInterface from "./pages/VoiceInterface";
import Grammar from "./components/Grammar";
import Pronunciation from "./components/Pronounciation";
import Faq from "./components/Faq";
import TermsOfUse from "./components/Termsofuse";
import PrivacyPolicy from "./components/Privacy";
import ProtectedRoute from "./components/ProtectedRoute";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Toaster />
      <div style={{ minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/help" element={<Helpdesk />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/practicewithai" element={<PracticeWithAi />} />
          <Route path="/courses" element={<Morecourse />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/chat/:charId"
            element={
              <ProtectedRoute>
                <VoiceInterface />
              </ProtectedRoute>
            }
          />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/pronounciation" element={<Pronunciation />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/termsofuse" element={<TermsOfUse />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
