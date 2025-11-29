import React from "react";
import { Link } from "react-router-dom";
import BLOGS from "../../data/blogData";

/**
 * Displays a grid of all blog previews: image, title, excerpt, meta, "Read More".
 * Fully accessible and mobile-responsive.
 */
function BlogList() {
  return (
    <section className="max-w-6xl mx-auto py-10 px-2">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">SpeakEZ Blog</h1>
        <p className="text-lg text-gray-600">
          Read our expert tips, reviews, and tech breakdowns in language
          learning.
          <br />
          <span className="italic">Hand-picked for your speaking journey.</span>
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {BLOGS.map((blog) => (
          <article
            key={blog.slug}
            className="bg-base-100 rounded-xl shadow-lg overflow-hidden flex flex-col"
          >
            <Link
              to={`/blogs/${blog.slug}`}
              aria-label={blog.title}
              className="block"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </Link>
            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-2xl font-bold mb-1">
                <Link to={`/blogs/${blog.slug}`} className="hover:text-primary">
                  {blog.title}
                </Link>
              </h2>
              <div className="text-md text-gray-500 mb-2">
                <span>{blog.author}</span>
                <span className="mx-1">&bull;</span>
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </div>
              <p className="flex-1 text-gray-700 mb-4">{blog.excerpt}</p>
              <Link
                to={`/blogs/${blog.slug}`}
                className="btn btn-primary self-start"
                aria-label={`Read more about ${blog.title}`}
              >
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BlogList;
