/**
 * PrivacyPolicy.jsx
 * Animated, icon-rich, accessible Privacy Policy page.
 */
import React from "react";
import { HiOutlineLockClosed } from "react-icons/hi2";
import {
  RiShieldCheckFill,
  RiUser3Fill,
  RiShareForwardFill,
  RiLockPasswordFill,
  RiMailSendFill,
} from "react-icons/ri";
import { MdOutlineCookie } from "react-icons/md";

const policies = [
  {
    heading: "1. Information Collection",
    body: "We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.",
    icon: (
      <RiUser3Fill
        className="inline text-primary text-xl align-middle animate-bounce"
        title="Information Collection"
      />
    ),
  },
  {
    heading: "2. How We Use Information",
    body: "We use the information we collect to provide, maintain, and improve our services, and to communicate with you.",
    icon: (
      <RiShieldCheckFill
        className="inline text-success text-xl align-middle animate-pulse"
        title="Usage"
      />
    ),
  },
  {
    heading: "3. Information Sharing",
    body: "We do not share your personal information with third parties except as described in this policy or with your consent.",
    icon: (
      <RiShareForwardFill
        className="inline text-info text-xl align-middle animate-spin-slow"
        title="Sharing"
      />
    ),
  },
  {
    heading: "4. Data Security",
    body: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.",
    icon: (
      <RiLockPasswordFill
        className="inline text-error text-xl align-middle animate-shake"
        title="Security"
      />
    ),
  },
  {
    heading: "5. Cookies and Tracking",
    body: "We use cookies and similar technologies to track activity on our service and hold certain information.",
    icon: (
      <MdOutlineCookie
        className="inline text-warning text-xl align-middle animate-pulse"
        title="Cookies"
      />
    ),
  },
  {
    heading: "6. Contact Us",
    body: "If you have any questions about this Privacy Policy, please contact us at support@speakez.com.",
    icon: (
      <RiMailSendFill
        className="inline text-secondary text-xl align-middle animate-wiggle"
        title="Contact"
      />
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-[80vh] bg-base-100 text-base-content py-10 px-4 md:px-8 flex flex-col items-center">
      <section
        className="max-w-2xl w-full bg-base-200 rounded-xl shadow-xl p-6 md:p-10 animate-fadeInUp"
        style={{
          animation: "fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="flex flex-row justify-center items-center mb-4 gap-2 animate-fadeIn">
          <HiOutlineLockClosed
            className="text-4xl text-primary animate-wiggle"
            title="Privacy Policy"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Privacy Policy
          </h1>
        </div>
        <p className="mb-6 text-base-content animate-fadeIn delay-100">
          Your privacy is important to us. This policy explains how we handle
          your data.
        </p>
        <ul className="space-y-5">
          {policies.map(({ heading, body, icon }, idx) => (
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
