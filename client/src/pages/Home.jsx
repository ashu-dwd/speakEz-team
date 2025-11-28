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
import Header from "../components/Header";
import Student from "../components/Student";

import Faq from "../components/Faq";
import CTA from "../components/CTA";

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
    <div className="min-h-screen bg-base-100">
      <Header />

      {/* Hero Section */}
      <section className="hero min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-accent/10">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <div className="badge badge-primary badge-lg mb-6">🚀 AI-Powered Learning</div>
            <h1 className="text-6xl lg:text-8xl font-black text-base-content mb-8 leading-tight">
              Speak English
              <span className="text-primary block">Confidently</span>
            </h1>
            <p className="text-2xl text-base-content/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Master English conversation with personalized AI coaching.
              Get real-time feedback, build fluency, and speak like a native speaker.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link to="/signup">
                <button className="btn btn-primary btn-xl px-12 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                  Start Free Trial
                  <ArrowRight className="ml-3 w-6 h-6" />
                </button>
              </Link>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-base-content/60">Happy Learners</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-base-content/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                No setup required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                24/7 AI support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-24 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-base-content mb-8">
                Tired of Traditional Learning?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-error font-bold">✗</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content mb-2">Boring Grammar Drills</h3>
                    <p className="text-base-content/70">Hours of memorization that don't help you speak</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-error font-bold">✗</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content mb-2">Expensive Tutors</h3>
                    <p className="text-base-content/70">Hundreds per hour with limited availability</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-error font-bold">✗</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content mb-2">No Feedback</h3>
                    <p className="text-base-content/70">Practice alone without knowing if you're improving</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-primary mb-8">
                Meet SpeakEz
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content mb-2">AI Conversations</h3>
                    <p className="text-base-content/70">Practice real scenarios with intelligent AI</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content mb-2">Instant Feedback</h3>
                    <p className="text-base-content/70">Get pronunciation and fluency scores immediately</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content mb-2">Learn Your Way</h3>
                    <p className="text-base-content/70">Adaptive lessons that match your pace and goals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-base-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-base-content mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-2xl text-base-content/70 max-w-3xl mx-auto">
              Powerful features designed for real English learning
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="card-title text-xl mb-4">{feature.title}</h3>
                  <p className="text-base-content/80 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-base-content mb-6">
              How SpeakEz Works
            </h2>
            <p className="text-2xl text-base-content/70">
              Three simple steps to English mastery
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="card bg-base-100 shadow-xl w-full lg:w-1/3">
                <div className="card-body text-center">
                  <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    {idx + 1}
                  </div>
                  <step.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="card-title text-2xl mb-4">{step.title}</h3>
                  <p className="text-base-content/80">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="py-24 bg-base-100">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-base-content mb-6">
                See It In Action
              </h2>
              <p className="text-2xl text-base-content/70 mb-8">
                Watch real learners improve their English with SpeakEz
              </p>
            </div>
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body p-0">
                <iframe
                  className="w-full aspect-video rounded-2xl"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="SpeakEz Demo"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-base-content mb-6">
              Real Results, Real People
            </h2>
            <p className="text-2xl text-base-content/70">
              Join thousands who've transformed their English skills
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Student />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-base-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-base-content mb-6">
              Choose Your Plan
            </h2>
            <p className="text-2xl text-base-content/70 max-w-3xl mx-auto">
              Start free today. Upgrade when you're ready to accelerate your learning.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`card bg-base-100 shadow-xl ${tier.popular ? 'border-primary border-4 scale-105' : 'border-base-300 border'}`}>
                {tier.popular && (
                  <div className="badge badge-primary badge-lg absolute -top-4 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </div>
                )}
                <div className="card-body text-center">
                  <h3 className="card-title text-3xl mb-4">{tier.name}</h3>
                  <div className="text-6xl font-black text-primary mb-4">{tier.price}</div>
                  <p className="text-base-content/70 mb-8 text-lg">{tier.description}</p>
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center justify-start">
                        <CheckCircle className="w-6 h-6 text-success mr-4 flex-shrink-0" />
                        <span className="text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="card-actions justify-center">
                    <Link to="/payment" className="w-full">
                      <button className={`btn w-full btn-lg ${tier.popular ? 'btn-primary' : 'btn-outline'}`}>
                        {tier.name === 'Starter' ? 'Start Free' : 'Get Started'}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-primary to-accent text-primary-content">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-8">
            Ready to Speak English Like a Pro?
          </h2>
          <p className="text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
            Join the thousands of learners who are already speaking confidently.
            Your English journey starts with one conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link to="/signup">
              <button className="btn btn-secondary btn-xl px-12 py-4 text-xl font-semibold">
                Start Your Free Trial Now
                <Zap className="ml-3 w-6 h-6" />
              </button>
            </Link>
            <button className="btn btn-outline btn-xl px-12 py-4 text-xl">
              Schedule a Demo
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-lg opacity-90">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              30-day money-back guarantee
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Setup in under 2 minutes
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-base-content mb-12">
              Got Questions? We've Got Answers
            </h2>
            <Faq />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
