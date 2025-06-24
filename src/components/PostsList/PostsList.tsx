import React, { useState, useEffect } from "react";
import { Post } from "../../types/Post";
import styles from "./PostsList.module.css";

interface PostsListProps {
  userId: number;
}

const PostsList: React.FC<PostsListProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const postsData: Post[] = await response.json();
        setPosts(postsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const togglePostExpansion = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>User Posts</h3>
        <div className={styles.loading}>
          <div
            className={styles.spinner}
            role="progressbar"
            aria-label="Loading posts"
          ></div>
          <span>Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>User Posts</h3>
        <div className={styles.error}>
          <span>Failed to load posts: {error}</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>User Posts</h3>
        <div className={styles.emptyState}>
          <span>No posts found for this user.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>User Posts ({posts.length})</h3>
      <div className={styles.postsList}>
        {posts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <button
              className={styles.postHeader}
              onClick={() => togglePostExpansion(post.id)}
              aria-expanded={expandedPost === post.id}
              aria-controls={`post-content-${post.id}`}
            >
              <h4 className={styles.postTitle}>{post.title}</h4>
              <span className={styles.expandIcon}>
                {expandedPost === post.id ? "−" : "+"}
              </span>
            </button>
            {expandedPost === post.id && (
              <div
                id={`post-content-${post.id}`}
                className={styles.postContent}
              >
                <p className={styles.postBody}>{post.body}</p>
                <div className={styles.postMeta}>Post ID: {post.id}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsList;
