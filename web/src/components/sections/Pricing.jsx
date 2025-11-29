import React from 'react';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '5 conversations per day',
        'Basic AI characters',
        'Progress tracking',
        'Email support'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'month',
      features: [
        'Unlimited conversations',
        'Custom AI characters',
        'Advanced analytics',
        'Priority support',
        'Offline mode'
      ],
      buttonText: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      features: [
        'Everything in Pro',
        'Team management',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div id="pricing" className="min-h-screen flex items-center justify-center bg-base-200 section">
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-5xl font-bold text-center mb-16">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {plans.map((plan, index) => (
            <div key={index} className={`card bg-base-100 shadow-xl hover:scale-105 transition-transform ${plan.popular ? 'border-primary border-2' : ''}`}>
              <div className="card-body">
                {plan.popular && <div className="badge badge-primary mb-4">Most Popular</div>}
                <h3 className="card-title text-3xl">{plan.name}</h3>
                <div className="text-5xl font-bold mb-4">
                  {plan.price}
                  <span className="text-xl font-normal">/{plan.period}</span>
                </div>
                <ul className="mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} w-full hover:scale-105 transition-transform`}>
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