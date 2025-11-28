import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Clock,
  Mic,
  BookOpen,
  Star,
  Play,
  CheckCircle,
  Zap,
  Shield,
  Award,
  Video,
  Smartphone,
  GraduationCap,
} from "lucide-react";
import Header from "../Header/Header";
import Student from "../student/Student";

import Faq from "../Faq/Faq";
import CTA from "../CTA/CTA";

const Home = () => {
  const stats = [
    { icon: Users, number: "10K+", label: "Happy Learners" },
    { icon: Clock, number: "24/7", label: "AI Practice" },
    { icon: Mic, number: "95%", label: "Accuracy" },
    { icon: BookOpen, number: "50+", label: "Lessons" },
  ];

  const features = [
    {
      title: "AI-Powered Speaking Practice",
      description:
        "Practice conversations with intelligent AI that corrects pronunciation, fluency, and grammar in real-time.",
      icon: Mic,
    },
    {
      title: "Personalized Learning Paths",
      description:
        "Adaptive lessons based on your progress, skill level, and goals. Never feel lost again.",
      icon: BookOpen,
    },
    {
      title: "Instant Feedback & Analytics",
      description:
        "Get detailed reports on your speaking improvement with voice recognition accuracy scores.",
      icon: Star,
    },
    {
      title: "Interactive Grammar & Vocab",
      description:
        "Learn through conversations, not boring drills. Context-based learning that sticks.",
      icon: Clock,
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Speak Freely",
      description:
        "Record your voice answering real conversation prompts. No judgment, just practice.",
      icon: Mic,
    },
    {
      step: "2",
      title: "Get AI Feedback",
      description:
        "Our AI analyzes pronunciation, fluency, grammar, and gives you a score + tips.",
      icon: Zap,
    },
    {
      step: "3",
      title: "Improve & Track",
      description:
        "Repeat, see your progress chart, and unlock advanced conversations.",
      icon: GraduationCap,
    },
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect to get started",
      features: [
        "10 min/day AI practice",
        "Basic pronunciation check",
        "5 lessons access",
        "Community support",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$19/mo",
      description: "Most popular",
      features: [
        "Unlimited AI conversations",
        "Full analytics dashboard",
        "50+ interactive lessons",
        "Advanced grammar correction",
        "Progress certificates",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: "$39/mo",
      description: "Everything included",
      features: [
        "All Pro features",
        "Priority AI responses",
        "Custom conversation topics",
        "1:1 coach sessions",
        "Lifetime access guarantee",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <Header />

      {/* Features Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-6">
            Speak English Like a Native
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our AI analyzes your speech, provides instant feedback, and helps
            you build confidence. No tutors needed.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-gradient-to-b from-white to-slate-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100"
            >
              <feature.icon className="w-16 h-16 text-blue-500 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <stat.icon className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <div className="text-4xl md:text-5xl font-black mb-2">
                {stat.number}
              </div>
              <div className="text-blue-100 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How SpeakEz Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple 3-step process powered by cutting-edge AI
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {howItWorks.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <step.icon className="w-10 h-10" />
              </div>
              <div className="text-4xl font-black text-blue-600 mb-4 group-hover:text-blue-500">
                {step.step}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your learning style. Cancel anytime.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl border-4 transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 ${tier.popular ? "border-blue-500 bg-gradient-to-b from-blue-50 to-white shadow-2xl scale-105" : "border-gray-200 bg-white shadow-lg"}`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-xl font-bold text-sm">
                  Most Popular
                </div>
              )}
              <h3 className="text-3xl font-black text-gray-900 mb-4">
                {tier.name}
              </h3>
              <div className="text-5xl font-black text-gray-900 mb-4">
                {tier.price}
              </div>
              <p className="text-gray-600 mb-8">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/payment">
                <button
                  className={`w-full py-6 rounded-2xl font-bold text-lg transition-all duration-300 ${tier.popular ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1" : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-blue-100 text-gray-900 border-2 border-gray-300 hover:border-blue-300"}`}
                >
                  Get Started
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Video */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            See SpeakEz in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how our AI gives real-time feedback on pronunciation and
            fluency
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Demo Video Embed - Replace with your actual YouTube video ID */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=0&controls=1&rel=0"
              title="SpeakEz AI Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Learners Are Saying
          </h2>
          <p className="text-xl text-gray-600">
            Join 10,000+ students transforming their English skills
          </p>
        </div>
        <Student />
      </section>

      {/* CTA Section */}
      <CTA />
      {/* FAQ */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <Faq />
        </div>
      </section>
    </div>
  );
};

export default Home;
