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
    <div className="h-[80vh] flex items-center justify-center bg-base-100 section">
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-5xl font-bold text-center mb-16">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-xl hover:scale-105 transition-transform"
            >
              <div className="card-body">
                <p className="text-xl italic">"{testimonial.content}"</p>
                <div className="flex items-center mt-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-6">
                    <h4 className="text-lg font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-base text-base-content/70">
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
