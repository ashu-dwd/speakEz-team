import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Sign Up & Customize",
      description: "Create your account and set up your learning preferences.",
    },
    {
      step: "02",
      title: "Choose Your AI Character",
      description:
        "Select from pre-made characters or create your own custom tutor.",
    },
    {
      step: "03",
      title: "Start Conversing",
      description: "Begin voice conversations and receive real-time feedback.",
    },
    {
      step: "04",
      title: "Track Your Progress",
      description: "View detailed analytics and celebrate your improvements.",
    },
  ];

  return (
    <div
      id="how-it-works"
      className="min-h-screen flex items-center justify-center bg-base-200 section py-12 sm:py-16 md:py-20"
    >
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary text-primary-content rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold mx-auto mb-4 sm:mb-6">
                {step.step}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-base-content/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
