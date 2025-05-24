import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./StudentPortal.css";

// Mock posts data for initial load or fallback
const postsMock = [
  {
    id: 1,
    user: "The Supreme Student Council",
    content:
      "JUST IN: Benjamin Remetilla... endorsed party for UDM SSG Elections 2025.",
    likes: 2,
    comments: [
      { user: "Alice", text: "Nice!" },
      { user: "Bob", text: "Wow" },
    ],
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
  },
  {
    id: 2,
    user: "Student Organization",
    content: "Exciting news: New workshop on leadership skills this Friday!",
    likes: 5,
    comments: [
      { user: "Charlie", text: "Great!" },
      { user: "Dave", text: "Count me in" },
    ],
    createdAt: Date.now() - 39 * 60 * 1000, // 39 minutes ago
  },
];

// Accessibility: Bind Modal to root element
Modal.setAppElement("#root");

// Helper function to format relative time strings for posts
function timeAgo(time) {
  const now = Date.now();
  const diff = now - time;

  if (diff < 0) return "just now"; // fallback for future dates

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;

  // fallback to exact date for older posts
  return new Date(time).toLocaleDateString();
}

function MainContent() {
  // Load posts from localStorage or use mock data as fallback
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("posts");
      if (saved) {
        const parsedPosts = JSON.parse(saved);
        // Ensure all posts have createdAt date
        return parsedPosts.map((p) => ({
          ...p,
          createdAt: p.createdAt || Date.now(),
        }));
      } else {
        return postsMock;
      }
    } catch {
      return postsMock;
    }
  });

  // State for controlling modals and inputs
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Keep track of which posts have been liked to prevent multiple likes
  const [likedPostIds, setLikedPostIds] = useState(() => {
    try {
      const saved = localStorage.getItem("likedPostIds");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Manage comment input text for each post separately
  const [commentInputs, setCommentInputs] = useState({});

  // Trigger component re-render every minute to refresh relative times
  const [, setTimeTick] = useState(0);

  const currentUserId = "You"; // Simulated current user name

  // Persist posts data to localStorage on every posts change
  useEffect(() => {
    try {
      localStorage.setItem("posts", JSON.stringify(posts));
    } catch (e) {
      console.error("Failed to save posts to localStorage", e);
    }
  }, [posts]);

  // Persist liked posts IDs to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("likedPostIds", JSON.stringify(Array.from(likedPostIds)));
    } catch (e) {
      console.error("Failed to save likedPostIds to localStorage", e);
    }
  }, [likedPostIds]);

  // Interval to update time ago every minute for freshness
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick((tick) => tick + 1);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle image file selection and convert to data URL for preview and storage
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Add Post modal
  const handleAddPost = () => {
    setIsAddPostOpen(true);
  };

  // On submitting post, open authentication modal to confirm identity
  const handlePostSubmit = () => {
    setIsAddPostOpen(false);
    setIsAuthModalOpen(true);
  };

  // Validate passkey, then save new post to posts list
  const handleAuthSubmit = () => {
    if (authKey === "admin123") {
      const newPostObj = {
        id: Date.now(),
        user: currentUserId,
        content: newPost,
        likes: 0,
        comments: [],
        image: selectedImage,
        createdAt: Date.now(),
      };
      setPosts([newPostObj, ...posts]); // Newest first
      setNewPost("");
      setAuthKey("");
      setSelectedImage(null);
      setIsAuthModalOpen(false);
    } else {
      alert("Incorrect passkey. Post cancelled.");
      setIsAuthModalOpen(false);
    }
  };

  // Increase likes count if user hasn't liked the post yet
  const handleLike = (postId) => {
    if (likedPostIds.has(postId)) return; // prevent multiple likes

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
    setLikedPostIds((prev) => new Set(prev).add(postId));
  };

  // Update the comment input state for a post
  const handleCommentChange = (postId, text) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: text,
    }));
  };

  // Add new comment from current user to the specified post
  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment = { user: currentUserId, text: commentText };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );

    // Clear comment input after posting
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  return (
    <main className="main-content">
      <div className="carousel">
        <img src="/slider.png" alt="Slider" className="carousel-img" />
        <div className="Txtonimg">
          <h2>DBADING KAYONG LAGAT BETBET</h2>
          <p>
            kgdfkfdkgj betlog jajaj hindi ko na alama ano ba dapat ilagay dito
            basta mapahaba at mag mukhang summary kase kailangan ng sample format
            banda dito bleh bleh bleh
          </p>
        </div>
      </div>

      <button className="add-post-btn" onClick={handleAddPost}>
        Add Post
      </button>

      <h2 className="section-title">ANNOUNCEMENT</h2>

      {/* Render each post */}
      {posts.map((post) => {
        const liked = likedPostIds.has(post.id);
        return (
          <div className="post-card" key={post.id}>
            <div className="post-header">
              <strong>{post.user}</strong> <span className="dot">•</span>{" "}
              <span>{timeAgo(post.createdAt)}</span>
              <img
                className="post-img"
                src="/announcement_post.png"
                alt="Post"
              />
            </div>
            <p className="post-caption">{post.content}</p>

            {/* Show image attachment if any */}
            {post.image && (
              <img
                src={post.image}
                alt="Post attachment"
                className="post-image-preview"
              />
            )}

            <div className="likes">
              <button
                className={`like-btn ${liked ? "liked" : ""}`}
                onClick={() => handleLike(post.id)}
                disabled={liked}
                title={liked ? "You liked this" : "Like"}
              >
                👍 {post.likes} Likes
              </button>
            </div>

            {/* Comments section */}
            <div className="comments-section">
              <div className="comments-list">
                {post.comments.length === 0 && (
                  <p className="no-comments">No comments yet.</p>
                )}
                {post.comments.map((comment, index) => (
                  <p key={index} className="comment">
                    <span className="comment-user">{comment.user}:</span>{" "}
                    <span className="comment-text">{comment.text}</span>
                  </p>
                ))}
              </div>

              {/* Comment input and submit */}
              <div className="comment-input-wrapper">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddComment(post.id);
                    }
                  }}
                  className="comment-input"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  disabled={!(commentInputs[post.id]?.trim())}
                  className="btn-comment-submit"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal for creating a new post */}
      <Modal
        isOpen={isAddPostOpen}
        onRequestClose={() => setIsAddPostOpen(false)}
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Create Post</h2>

        <div className="post-user-info">
          <img src="/your-avatar.png" alt="User Avatar" className="avatar" />
          <span className="username">You</span>
        </div>

        <textarea
          rows="4"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="post-textarea"
        />

        {/* Image upload */}
        <div className="image-upload-container">
          <label htmlFor="imageUpload" className="image-upload-label">
            + Add Photo
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Preview selected image */}
        {selectedImage && (
          <img src={selectedImage} alt="Preview" className="image-preview" />
        )}

        <div className="modal-btn-group">
          <button
            className="btn btn-submit"
            onClick={handlePostSubmit}
            disabled={!newPost.trim() && !selectedImage}
          >
            Submit
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => {
              setIsAddPostOpen(false);
              setNewPost("");
              setSelectedImage(null);
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Modal for authentication before posting */}
      <Modal
        isOpen={isAuthModalOpen}
        onRequestClose={() => setIsAuthModalOpen(false)}
        className="Modal AuthModal"
        overlayClassName="Overlay"
      >
        <h2>Confirm Your Identity</h2>
        <input
          type="password"
          value={authKey}
          onChange={(e) => setAuthKey(e.target.value)}
          placeholder="Enter passkey"
          className="auth-input"
        />
        <div className="modal-btn-group">
          <button
            className="btn btn-submit"
            onClick={handleAuthSubmit}
            disabled={!authKey.trim()}
          >
            Confirm
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => {
              setIsAuthModalOpen(false);
              setAuthKey("");
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </main>
  );
}

export default MainContent;
