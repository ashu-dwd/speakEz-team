import React from "react";
import Navbar from "../Navbar";
import Header from "../Header/Header";
import Courses from "../course/Courses";
import Student from "../student/Student";
import Newsletter from "../Newsletter/Newsletter";
import Faq from "../Faq/Faq";

const Home = () => {
  return (
    <div>
      <Header />
      <Courses />
      <Student />
      <Newsletter />
      <Faq />
    </div>
  );
};
export default Home;
