import React from "react";

const Features = () => {
  const features = [
    {
      icon: "🎤",
      title: "Voice-Activated Conversations",
      description:
        "Have natural voice chats with AI characters that respond in real-time.",
    },
    {
      icon: "🤖",
      title: "Custom AI Characters",
      description:
        "Create personalized AI tutors for different scenarios and personalities.",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description:
        "Monitor your improvement with detailed analytics and statistics.",
    },
    {
      icon: "🧠",
      title: "Grammar & Vocabulary Practice",
      description:
        "Get instant feedback on pronunciation, grammar, and vocabulary usage.",
    },
    {
      icon: "🔐",
      title: "Secure Authentication",
      description:
        "Your learning data is protected with robust security measures.",
    },
    {
      icon: "📚",
      title: "Interactive Courses",
      description:
        "Structured learning paths tailored to your goals and level.",
    },
  ];

  return (
    <div
      id="features"
      className="min-h-screen flex items-center justify-center bg-base-100 section py-12 sm:py-16 md:py-20"
    >
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
          Why Choose SpeakEZ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-xl hover:scale-105 transition-transform"
            >
              <div className="card-body items-center text-center p-4 sm:p-6 md:p-8">
                <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6">
                  {feature.icon}
                </div>
                <h3 className="card-title text-lg sm:text-xl md:text-2xl">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
