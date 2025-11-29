import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className="hero min-h-screen bg-base-200 section"
      style={{ backgroundImage: "url(/hero.jpg)" }}
    >
      <div className="hero-content text-center">
        <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            Master Languages Through Conversation
          </h1>
          <p className="py-6 sm:py-8 md:py-12 text-base sm:text-lg md:text-xl lg:text-2xl">
            SpeakEZ revolutionizes language learning with AI-powered voice
            conversations. Practice speaking naturally with custom AI characters
            and track your progress.
          </p>
          <Link
            to="/signup"
            className="btn btn-primary btn-md sm:btn-lg hover:scale-105 transition-transform min-h-[44px] px-6 sm:px-8"
          >
            Start Learning Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
