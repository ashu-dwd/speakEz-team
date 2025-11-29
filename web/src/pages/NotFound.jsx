/**
 * NotFound.jsx
 * Redesigned: Animated, icon-enhanced, and fully accessible 404 page.
 */
import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineSearchOff } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col justify-center items-center bg-base-100 text-base-content py-12 px-4">
      <section
        className="w-full max-w-md bg-base-200 text-center rounded-xl shadow-xl p-6 md:p-10
        animate-fadeInUp"
        style={{
          animation: "fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="flex flex-col items-center mb-6">
          <MdOutlineSearchOff
            className="text-error text-7xl animate-bounce"
            title="Not found"
          />
        </div>
        <h1 className="text-7xl font-extrabold text-error mb-2 animate-fadeIn">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-accent mb-3 animate-fadeIn delay-200">
          Page Not Found
        </h2>
        <p className="mb-6 text-base-content animate-fadeIn delay-300">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-content font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow transition hover:bg-primary/90 animate-fadeIn delay-500"
          aria-label="Go to Homepage"
        >
          <FaArrowLeft aria-hidden="true" />
          Go Home
        </Link>
      </section>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn { animation: fadeIn 1s both; }
        .animate-fadeInUp { animation: fadeInUp 1s both; }
      `}</style>
    </main>
  );
}
