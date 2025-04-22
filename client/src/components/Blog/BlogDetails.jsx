import React from 'react';
import { useParams, Link } from 'react-router-dom';
import blogPosts from './blogdata'; // Make sure the path is correct
import './BlogDetails.css';

const BlogDetails = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="blog-detail-page">
        <h2>Post not found</h2>
        <Link to="/blog" className="back-link">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <h1 className="detail-title">{post.title}</h1>
      <p className="detail-date">{post.date}</p>
      <div className="detail-content">
        {post.content.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <Link to="/blog" className="back-link">← Back to Blog</Link>
    </div>
  );
};

export default BlogDetails;
