import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaSignInAlt,
  FaGavel,
  FaHome,
  FaSignOutAlt,
  FaTachometerAlt,
  FaCog,
} from "react-icons/fa";
import axiosInstance from "../../utils/axios";

// ... (imports remain the same)

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for auth token in local or session storage
    const auth = localStorage.getItem("auth") || sessionStorage.getItem("auth");
    if (auth) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
    } catch (error) {
      console.error("Logout failed on server", error);
    } finally {
      // Always clear local state even if server fails
      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");
      setIsLoggedIn(false);
      navigate("/");
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-10">
      {/* Left: Brand and Mobile Menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden text-xl"
          >
            {/* Hamburger menu */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-60 p-2 shadow z-[1]"
          >
            <li>
              <Link to="/" className="flex items-center gap-2 text-base">
                <FaHome /> Home
              </Link>
            </li>
            <li>
              <a href="#features" className="flex items-center gap-2 text-base">
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 text-base"
              >
                How It Works
              </a>
            </li>
            <li>
              <a href="#pricing" className="flex items-center gap-2 text-base">
                Pricing
              </a>
            </li>
            <li>
              <Link to="/terms" className="flex items-center gap-2 text-base">
                <FaGavel /> Terms of Service
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-base"
                  >
                    <FaTachometerAlt /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 text-base"
                  >
                    <FaCog /> Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-base text-error"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/signup"
                    className="flex items-center gap-2 text-base"
                  >
                    <FaUserPlus /> Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-base"
                  >
                    <FaSignInAlt /> Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <Link
          to="/"
          className="btn btn-ghost text-lg sm:text-xl font-bold gap-1 sm:gap-2"
        >
          🎤 SpeakEZ
        </Link>
      </div>
      {/* Center: Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-sm sm:text-base">
          <li>
            <Link to="/" className="flex items-center gap-1">
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#how-it-works">How It Works</a>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <Link to="/terms" className="flex items-center gap-1">
              <FaGavel /> Terms
            </Link>
          </li>
        </ul>
      </div>
      {/* End: Auth buttons */}
      <div className="navbar-end flex-grow justify-end gap-1 sm:gap-2 pr-2 sm:pr-4 md:pr-6">
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="btn btn-primary btn-xs sm:btn-sm flex items-center gap-1 sm:gap-2 hover:scale-105 transition-transform min-h-[36px] sm:min-h-[40px] px-2 sm:px-3"
              aria-label="Dashboard"
            >
              <FaTachometerAlt />{" "}
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              to="/settings"
              className="btn btn-ghost btn-xs sm:btn-sm flex items-center gap-1 sm:gap-2 hover:scale-105 transition-transform min-h-[36px] sm:min-h-[40px] px-2 sm:px-3"
              aria-label="Settings"
            >
              <FaCog /> <span className="hidden sm:inline">Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-error btn-xs sm:btn-sm flex items-center gap-1 sm:gap-2 hover:scale-105 transition-transform min-h-[36px] sm:min-h-[40px] px-2 sm:px-3"
              aria-label="Logout"
            >
              <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              className="btn btn-primary btn-xs sm:btn-sm flex items-center gap-1 sm:gap-2 hover:scale-105 transition-transform min-h-[36px] sm:min-h-[40px] px-2 sm:px-3"
              aria-label="Sign Up"
            >
              <FaUserPlus /> <span className="hidden sm:inline">Sign Up</span>
            </Link>
            <Link
              to="/login"
              className="btn btn-outline btn-xs sm:btn-sm flex items-center gap-1 sm:gap-2 hover:scale-105 transition-transform min-h-[36px] sm:min-h-[40px] px-2 sm:px-3"
              aria-label="Login"
            >
              <FaSignInAlt /> <span className="hidden sm:inline">Login</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
