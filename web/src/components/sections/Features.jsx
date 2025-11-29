import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '🎤',
      title: 'Voice-Activated Conversations',
      description: 'Have natural voice chats with AI characters that respond in real-time.'
    },
    {
      icon: '🤖',
      title: 'Custom AI Characters',
      description: 'Create personalized AI tutors for different scenarios and personalities.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics and statistics.'
    },
    {
      icon: '🧠',
      title: 'Grammar & Vocabulary Practice',
      description: 'Get instant feedback on pronunciation, grammar, and vocabulary usage.'
    },
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Your learning data is protected with robust security measures.'
    },
    {
      icon: '📚',
      title: 'Interactive Courses',
      description: 'Structured learning paths tailored to your goals and level.'
    }
  ];

  return (
    <div id="features" className="min-h-screen flex items-center justify-center bg-base-100 section">
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-5xl font-bold text-center mb-16">Why Choose SpeakEZ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-100 shadow-xl hover:scale-105 transition-transform">
              <div className="card-body items-center text-center">
                <div className="text-8xl mb-6">{feature.icon}</div>
                <h3 className="card-title text-2xl">{feature.title}</h3>
                <p className="text-lg">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;