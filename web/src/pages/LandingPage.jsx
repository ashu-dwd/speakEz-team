import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import HowItWorks from "../components/sections/HowItWorks";
import Testimonials from "../components/sections/Testimonials";
import Pricing from "../components/sections/Pricing";
import Footer from "../components/sections/Footer";

/**
 * LandingPage with prominent navigation to Login, Signup, and Terms of Service.
 */
const LandingPage = () => {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
    </div>
  );
};

export default LandingPage;
