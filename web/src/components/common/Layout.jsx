import React from "react";
import Navbar from "./Navbar";
import Footer from "../sections/Footer";

/**
 * Layout component: always displays Navbar at top and Footer at bottom.
 * Children are rendered between.
 */
const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="min-h-[70vh]">{children}</div>
    <Footer />
  </>
);

export default Layout;
