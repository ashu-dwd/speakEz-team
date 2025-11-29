import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer bg-neutral text-neutral-content p-6 sm:p-8 md:p-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
              🎤 SpeakEZ
            </h3>
            <p className="text-sm sm:text-base">
              Revolutionizing language learning through AI-powered
              conversations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base">
              Product
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a
                  href="#features"
                  className="link link-hover text-sm sm:text-base"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="link link-hover text-sm sm:text-base"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover text-sm sm:text-base">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover text-sm sm:text-base">
                  Integrations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base">
              Company
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a
                  href="/about"
                  className="link link-hover text-sm sm:text-base"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/blogs"
                  className="link link-hover text-sm sm:text-base"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="link link-hover text-sm sm:text-base"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="link link-hover text-sm sm:text-base"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base">
              Support
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a
                  href="/help-center"
                  className="link link-hover text-sm sm:text-base"
                >
                  Help Center
                </a>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="link link-hover text-sm sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="/terms"
                  className="link link-hover text-sm sm:text-base"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover text-sm sm:text-base">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="divider my-6 sm:my-8"></div>
        <div className="text-center">
          <p className="text-sm sm:text-base">
            &copy; 2025 SpeakEZ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
