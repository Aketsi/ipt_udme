import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import "./MainContent.css";
import ssgPostImage from "/assets/ssgpost.png";
import minkPostImage from "/assets/minkpost.png";

const postsMock = [
  {
    id: 1,
    user: "The Supreme Student Council",
    content: "JUST IN: Benjamin Remetilla... endorsed party for UDM SSG Elections 2025.",
    likes: 2,
    comments: [
      { user: "Alice", text: "Nice!" },
      { user: "Bob", text: "Wow" },
    ],
    image: ssgPostImage,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
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
    image: minkPostImage,
    createdAt: Date.now() - 39 * 60 * 1000,
  },
];

Modal.setAppElement("#root");

const timeAgo = (time) => {
  const now = Date.now();
  const diff = now - time;
  if (diff < 0) return "just now";

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;

  return new Date(time).toLocaleDateString();
};

// New: Carousel images array
const carouselImages = [
  { src: "/assets/slider.png", alt: "Slider 1", title: "Enrollment Season is Here: What Students Need to Know", desc: "As enrollment opens, students prepare to secure their slots for the upcoming semester. Stay informed with our guide to a hassle-free enrollment process." },
  { src: "/assets/ssgpost.png", alt: "Slider 2", title: "The Final Verdict: SSG Elections Results Are In!", desc: "Students have cast their votes, and the results for the SSG elections are officially out. Find out who emerged victorious and what it means for the school." },
  { src: "/assets/iskudm.jpg", alt: "Slider 3", title: "Unpacking the Allegations:UDM, BINENTA?", desc: "Isko Moreno’s name is now linked with the sale of UDM, sparking widespread discussions. Here’s a quick overview of what’s happening behind the scenes." },
];

function MainContent() {
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef(null);

  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("posts");
      if (saved) {
        return JSON.parse(saved).map((p) => ({
          ...p,
          createdAt: p.createdAt !== undefined ? p.createdAt : Date.now(),
        }));
      }
    } catch {
      // ignore parse errors
    }
    return postsMock;
  });

  const [likedPostIds, setLikedPostIds] = useState(() => {
    try {
      const saved = localStorage.getItem("likedPostIds");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [, setTimeTick] = useState(0);

  const currentUserId = "You";

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("likedPostIds", JSON.stringify(Array.from(likedPostIds)));
  }, [likedPostIds]);

  useEffect(() => {
    const interval = setInterval(() => setTimeTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Carousel auto-slide effect
  useEffect(() => {
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000); // change slide every 3 seconds

    return () => clearInterval(slideIntervalRef.current);
  }, []);

  // Optional: manual slide change (dots)
  const goToSlide = (index) => {
    setCurrentSlide(index);
    // reset interval so user can see slide for full 3 seconds
    clearInterval(slideIntervalRef.current);
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = () => {
    setIsAddPostOpen(false);
    setIsAuthModalOpen(true);
  };

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
      setPosts([newPostObj, ...posts]);
      setNewPost("");
      setAuthKey("");
      setSelectedImage(null);
      setIsAuthModalOpen(false);
    } else {
      alert("Incorrect passkey. Post cancelled.");
      setIsAuthModalOpen(false);
    }
  };

  const handleToggleLike = (postId) => {
    setLikedPostIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        // Unlike
        newSet.delete(postId);
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, likes: Math.max(post.likes - 1, 0) } : post
          )
        );
      } else {
        // Like
        newSet.add(postId);
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      }
      return newSet;
    });
  };

  const handleAddComment = (postId) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { user: currentUserId, text: comment }],
            }
          : post
      )
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setPosts(posts.filter((post) => post.id !== postId));
    setLikedPostIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
    setCommentInputs((prev) => {
      const newInputs = { ...prev };
      delete newInputs[postId];
      return newInputs;
    });
  };

  return (
    <main className="main-content">
      {/* Updated Carousel */}
      <div className="carousel">
        <img
          src={carouselImages[currentSlide].src}
          alt={carouselImages[currentSlide].alt}
          className="carousel-img"
        />
        <div className="Txtonimg">
          <h2>{carouselImages[currentSlide].title}</h2>
          <p>{carouselImages[currentSlide].desc}</p>
        </div>
        <div className="carousel-dots" aria-label="Carousel navigation dots">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-pressed={idx === currentSlide}
              type="button"
            />
          ))}
        </div>
      </div>

      <hr />

      <div className="ann-section">
        <img src="/assets/r-left.png" alt="ribbon" className="rib-left" />
        <h2 className="section-title">ANNOUNCEMENT</h2>
        <img src="/assets/r-right.png" alt="ribbon" className="rib-right" />
      </div>

      <button className="add-post-btn" onClick={() => setIsAddPostOpen(true)}>
        Create Post
      </button>

      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          <div className="post-header">
            <div className="left-group">
              <img
                className="post-img"
                src="/postl.png"
                alt="Post icon"
                aria-hidden="true"
              />
              <strong>{post.user}</strong>
              <span>{timeAgo(post.createdAt)}</span>
            </div>
            {post.user === currentUserId && (
              <button
                className="delete-btn"
                onClick={() => handleDeletePost(post.id)}
                aria-label="Delete post"
              >
                Delete
              </button>
            )}
          </div>
          {post.image && (
            <img
              src={post.image}
              alt="Post visual content"
              className="post-image-preview"
            />
          )}
          <div className="likes">
            <button
              className={`like-btn ${likedPostIds.has(post.id) ? "liked" : ""}`}
              onClick={() => handleToggleLike(post.id)}
              title={likedPostIds.has(post.id) ? "Unlike" : "Like"}
              aria-pressed={likedPostIds.has(post.id)}
            >
              {likedPostIds.has(post.id) ? "❤️" : "🤍"} {post.likes} Likes
            </button>
          </div>
          <p className="post-caption">{post.content}</p>
          <div className="comments-section">
            <div className="comments-list">
              {post.comments.length === 0 && (
                <p className="no-comments">No comments yet.</p>
              )}
              {post.comments.map((c, i) => (
                <p key={i} className="comment">
                  <span className="comment-user">{c.user}:</span>{" "}
                  <span className="comment-text">{c.text}</span>
                </p>
              ))}
            </div>
            <div className="comment-input-wrapper">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[post.id] || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddComment(post.id);
                  }
                }}
                className="comment-input"
                aria-label="Add comment"
              />
              <button
                className="btn-comment-submit"
                onClick={() => handleAddComment(post.id)}
                disabled={!commentInputs[post.id]?.trim()}
                aria-label="Submit comment"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      ))}

      <Modal
        isOpen={isAddPostOpen}
        onRequestClose={() => setIsAddPostOpen(false)}
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Create Post</h2>
        <div className="post-user-info">
          <img src="/your-avatar.png" alt="User avatar" className="avatar" />
          <span className="username">{currentUserId}</span>
        </div>
        <textarea
          rows="4"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="post-textarea"
          aria-label="Post content"
        />
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
            aria-label="Upload image"
          />
        </div>
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
          aria-label="Passkey input"
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
