/**
 * TermsOfService.jsx
 * Redesigned: Animated, icon-rich, accessible Terms of Service page.
 */
import React from "react";
import { HiOutlineDocumentText } from "react-icons/hi2";
import {
  RiShieldCheckFill,
  RiUser3Fill,
  RiErrorWarningFill,
  RiRefreshLine,
  RiTeamFill,
} from "react-icons/ri";

const terms = [
  {
    heading: "1. Acceptance of Terms",
    body: "By using this site, you agree to comply with these Terms of Service. Please read them carefully.",
    icon: (
      <RiShieldCheckFill
        className="inline text-primary text-xl align-middle animate-pulse"
        title="Acceptance"
      />
    ),
  },
  {
    heading: "2. Changes to Terms",
    body: "We may update these terms from time to time. Continued use after changes constitutes acceptance.",
    icon: (
      <RiRefreshLine
        className="inline text-info text-xl align-middle animate-spin-slow"
        title="Update"
      />
    ),
  },
  {
    heading: "3. User Responsibilities",
    body: "You are responsible for maintaining confidentiality of your information and all activities under your account.",
    icon: (
      <RiUser3Fill
        className="inline text-secondary text-xl align-middle animate-bounce"
        title="User responsibility"
      />
    ),
  },
  {
    heading: "4. Privacy",
    body: "Please review our Privacy Policy to understand how your information is handled.",
    icon: (
      <RiShieldCheckFill
        className="inline text-success text-xl align-middle animate-pulse"
        title="Privacy"
      />
    ),
  },
  {
    heading: "5. Content & Restrictions",
    body: "You agree not to misuse our services or post harmful, illegal, or abusive content.",
    icon: (
      <RiErrorWarningFill
        className="inline text-error text-xl align-middle animate-shake"
        title="Restrictions"
      />
    ),
  },
  {
    heading: "6. Liability",
    body: "We are not liable for damages incurred from site use, within the extent permitted by law.",
    icon: (
      <RiTeamFill
        className="inline text-neutral text-xl align-middle animate-fadeIn"
        title="Liability"
      />
    ),
  },
];

export default function TermsOfService() {
  return (
    <main className="min-h-[80vh] bg-base-100 text-base-content py-10 px-4 md:px-8 flex flex-col items-center">
      <section
        className="max-w-2xl w-full bg-base-200 rounded-xl shadow-xl p-6 md:p-10 animate-fadeInUp"
        style={{
          animation: "fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="flex flex-row justify-center items-center mb-4 gap-2 animate-fadeIn">
          <HiOutlineDocumentText
            className="text-4xl text-primary animate-wiggle"
            title="Terms of Service"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Terms of Service
          </h1>
        </div>
        <p className="mb-6 text-base-content animate-fadeIn delay-100">
          Welcome to SpeakEz! Please review these terms before using our site.
        </p>
        <ul className="space-y-5">
          {terms.map(({ heading, body, icon }, idx) => (
            <li
              key={idx}
              className="animate-fadeInUp"
              style={{ animationDelay: `${0.15 * (idx + 1)}s` }}
            >
              <h2 className="text-lg font-semibold mb-1 text-secondary flex items-center gap-2">
                {icon}
                <span>{heading}</span>
              </h2>
              <p className="text-base-content">{body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-sm text-neutral-content animate-fadeIn delay-700">
          Last updated: November 29, 2025
        </div>
      </section>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(-5deg);}
          50% { transform: rotate(7deg);}
        }
        @keyframes shake {
          0%,100% { transform: translateX(0);}
          20% { transform: translateX(-7px);}
          40% { transform: translateX(7px);}
          60% { transform: translateX(-4px);}
          80% { transform: translateX(4px);}
        }
        .animate-fadeIn { animation: fadeIn 0.7s both;}
        .animate-fadeInUp { animation: fadeInUp 1.1s both;}
        .animate-wiggle { animation: wiggle 1.1s infinite;}
        .animate-shake { animation: shake 1.25s infinite;}
        .animate-spin-slow { animation: spin 2.4s linear infinite;}
        @keyframes spin {
          from { transform: rotate(0deg);}
          to { transform: rotate(360deg);}
        }
        .animate-pulse { animation: pulse 1.1s infinite;}
      `}</style>
    </main>
  );
}
