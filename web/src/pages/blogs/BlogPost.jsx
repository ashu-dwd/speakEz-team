import React from "react";
import { useParams, Link } from "react-router-dom";
import BLOGS from "../../data/blogData";

/**
 * Renders a single blog post by slug, or a 404-style message.
 * Renders with responsive, accessible, beautiful UI.
 */
function BlogPost() {
  const { slug } = useParams();
  const post = BLOGS.find((b) => b.slug === slug);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4 text-error">
          404: Blog Not Found
        </h1>
        <p>The blog post you are looking for does not exist.</p>
        <Link className="btn btn-primary mt-6" to="/blogs">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto p-4 md:p-8 bg-base-100 rounded-lg shadow-lg mt-10 mb-16">
      <header>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-6"
          loading="lazy"
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight">
          {post.title}
        </h1>
        <div className="flex gap-4 text-gray-500 text-md mb-2 flex-wrap">
          <span>{post.author}</span>
          <span>&bull;</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
        <div className="mb-6 italic text-lg text-gray-600">{post.excerpt}</div>
      </header>
      <section
        className="prose md:prose-lg prose-primary max-w-none"
        style={{ whiteSpace: "pre-line" }}
      >
        {post.content
          .split("\n")
          .map((line, i) =>
            line.startsWith("## ") ? (
              <h2 key={i}>{line.replace("## ", "")}</h2>
            ) : line.startsWith("### ") ? (
              <h3 key={i}>{line.replace("### ", "")}</h3>
            ) : (
              <p key={i}>{line}</p>
            )
          )}
      </section>
      <footer className="mt-12">
        <Link to="/blogs" className="btn btn-outline">
          ← All Blogs
        </Link>
      </footer>
    </article>
  );
}

export default BlogPost;
