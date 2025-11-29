import React from "react";
import { FaUserCircle } from "react-icons/fa";

/**
 * WelcomeSection - Personalized greeting for the user
 */
const WelcomeSection = ({ userName, profilePicture }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="card bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
      <div className="card-body p-6">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {profilePicture ? (
                <img src={profilePicture} alt={userName} />
              ) : (
                <div className="bg-primary text-primary-content flex items-center justify-center text-3xl w-full h-full">
                  {userName?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {getGreeting()}, {userName}!
            </h2>
            <p className="text-base-content/70 mt-1">
              Ready to master your speaking skills today?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
