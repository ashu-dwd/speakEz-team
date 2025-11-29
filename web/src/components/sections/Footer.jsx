import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer bg-neutral text-neutral-content p-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🎤 SpeakEZ</h3>
            <p>
              Revolutionizing language learning through AI-powered
              conversations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul>
              <li>
                <a href="#features" className="link link-hover">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="link link-hover">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Integrations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul>
              <li>
                <a href="/about" className="link link-hover">
                  About
                </a>
              </li>
              <li>
                <a href="/blogs" className="link link-hover">
                  Blog
                </a>
              </li>
              <li>
                <a href="/careers" className="link link-hover">
                  Careers
                </a>
              </li>
              <li>
                <a href="/contact" className="link link-hover">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul>
              <li>
                <a href="/help-center" className="link link-hover">
                  Help Center
                </a>
              </li>
              <li>
                <Link to="/privacy" className="link link-hover">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="/terms" className="link link-hover">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="divider my-8"></div>
        <div className="text-center">
          <p>&copy; 2025 SpeakEZ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
