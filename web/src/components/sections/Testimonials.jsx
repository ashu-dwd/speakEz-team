import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Language Enthusiast",
      content:
        "SpeakEZ has transformed how I learn Spanish. Conversing with AI characters feels so natural!",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    },
    {
      name: "Mike Chen",
      role: "Business Professional",
      content:
        "The progress tracking is incredible. I can see my improvement week by week.",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
    },
    {
      name: "Emma Rodriguez",
      role: "Student",
      content:
        "Custom characters make learning fun. I created a character that speaks like my favorite teacher.",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 section py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-xl hover:scale-105 transition-transform"
            >
              <div className="card-body p-4 sm:p-6 md:p-8">
                <p className="text-base sm:text-lg md:text-xl italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center mt-4 sm:mt-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="ml-3 sm:ml-4 md:ml-6">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs sm:text-sm md:text-base text-base-content/70">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
