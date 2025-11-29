import React from "react";

const Hero = () => {
  return (
    <div
      className="hero min-h-screen bg-base-200 section"
      style={{ backgroundImage: "url(/hero.jpg)" }}
    >
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold">
            Master Languages Through Conversation
          </h1>
          <p className="py-12 text-xl">
            SpeakEZ revolutionizes language learning with AI-powered voice
            conversations. Practice speaking naturally with custom AI characters
            and track your progress.
          </p>
          <button className="btn btn-primary btn-lg hover:scale-105 transition-transform">
            Start Learning Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
