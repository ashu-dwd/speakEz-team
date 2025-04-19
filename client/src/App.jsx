import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Contact from './components/pages/Contact';
import Helpdesk from './components/pages/Helpdesk';
import About from './components/pages/About';
import Signup from './components/pages/signup';
import Login from './components/pages/Login';

import './App.css'
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <> 
     <Navbar/>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Helpdesk/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer/>
    </>
  );
};

export default App;
