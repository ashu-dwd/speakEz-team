import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaVideo, FaComments } from "react-icons/fa";

/**
 * ActionCard - Primary CTA for starting a new practice session
 */
const ActionCard = () => {
  const navigate = useNavigate();

  const practiceTypes = [
    {
      icon: FaMicrophone,
      label: "Interview Prep",
      description: "Practice common interview questions",
      color: "primary",
      action: () => navigate("/interview-setup"),
    },
    {
      icon: FaVideo,
      label: "Public Speaking",
      description: "Practice with another person",
      color: "secondary",
      action: () => navigate("/call"),
    },
    {
      icon: FaComments,
      label: "Casual Chat",
      description: "Chat with other learners",
      color: "accent",
      action: () => navigate("/chat-rooms"),
    },
  ];

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300/50">
      <div className="card-body p-6">
        <h3 className="text-xl font-bold mb-4 text-base-content">
          Start Your Practice Session
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {practiceTypes.map((type, idx) => (
            <button
              key={idx}
              onClick={type.action}
              className="btn btn-outline hover:scale-105 transition-transform duration-200 flex-col h-auto py-4 gap-2"
            >
              <type.icon className={`text-3xl text-${type.color}`} />
              <div>
                <div className="font-semibold">{type.label}</div>
                <div className="text-xs opacity-70">{type.description}</div>
              </div>
            </button>
          ))}
        </div>
        <button className="btn btn-primary w-full text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
          <FaMicrophone className="text-xl" />
          Start Now
        </button>
      </div>
    </div>
  );
};

export default ActionCard;
