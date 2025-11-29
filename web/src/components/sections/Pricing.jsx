import React from "react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "5 conversations per day",
        "Basic AI characters",
        "Progress tracking",
        "Email support",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "month",
      features: [
        "Unlimited conversations",
        "Custom AI characters",
        "Advanced analytics",
        "Priority support",
        "Offline mode",
      ],
      buttonText: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      features: [
        "Everything in Pro",
        "Team management",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
      ],
      buttonText: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div
      id="pricing"
      className="min-h-screen flex items-center justify-center bg-base-200 section py-12 sm:py-16 md:py-20"
    >
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card bg-base-100 shadow-xl hover:scale-105 transition-transform ${
                plan.popular ? "border-primary border-2" : ""
              }`}
            >
              <div className="card-body p-4 sm:p-6 md:p-8">
                {plan.popular && (
                  <div className="badge badge-primary mb-2 sm:mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="card-title text-xl sm:text-2xl md:text-3xl">
                  {plan.name}
                </h3>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
                  {plan.price}
                  <span className="text-sm sm:text-base md:text-xl font-normal">
                    /{plan.period}
                  </span>
                </div>
                <ul className="mb-4 sm:mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center mb-1 sm:mb-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-success mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn ${
                    plan.popular ? "btn-primary" : "btn-outline"
                  } w-full hover:scale-105 transition-transform min-h-[44px] text-sm sm:text-base`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
