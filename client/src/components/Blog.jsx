import React from 'react';
import { Link } from 'react-router-dom';
import blogPosts from './blogdata'; 
import '../assets/Blog.css';

const Blog = () => {
  return (
    <div className="blog-page">
      <h1 className="blog-title">SpeakEZ Blog</h1>
      <p className="blog-subtitle">Insights, tips, and guides to help you become fluent in English!</p>

      <div className="blog-grid">
        {Array.isArray(blogPosts) && blogPosts.map((post) => (
          <div className="blog-card" key={post.id}>
            <h2 className="blog-post-title">{post.title}</h2>
            <p className="blog-date">{post.date}</p>
            <p className="blog-snippet">{post.snippet}</p>
            <Link to={`/blog/${post.id}`} className="read-more-link">Read More →</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;

