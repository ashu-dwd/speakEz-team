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
      className="h-[50vh] flex items-center justify-center bg-base-200 section"
    >
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-5xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary text-primary-content rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                {step.step}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-lg text-base-content/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
