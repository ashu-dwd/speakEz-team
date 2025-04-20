import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Helpdesk from './components/pages/Helpdesk';
import About from './components/pages/About';
import Signup from './components/pages/Signup';
import Login from './components/pages/Login';
import Forgotpassword from './components/pages/Forgot-password';
import Dashboard from './components/pages/Dashboard';
import './App.css'
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar';
import Otppage from './components/pages/otppage';
import Practicewithai from './components/pages/Practice'
import Morecourse from './components/Morecourse/Morecourse';
import Coursedetail from './components/Coursedetails/Coursedetails';
import Vocabulary from './components/pages/Vocabulary';
const App = () => {
  return (
    <> 
     <Navbar/>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/help" element={<Helpdesk/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-otp" element={<Otppage />} />
        <Route path="/practicewithai" element={<Practicewithai/>} />
        <Route path="/Morecourse" element={<Morecourse/>}/>
        <Route path="/course/:courseId" element={<Coursedetail />} />

        
        
      </Routes>
      <Footer/>
    </>
  );
};

export default App;
