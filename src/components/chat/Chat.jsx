import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import EmojiPicker from "emoji-picker-react";
import "./Chat.css";

Modal.setAppElement("#root");

// Key used for localStorage to persist chat messages globally
const CHAT_STORAGE_KEY = "globalGroupChatMessages";

// Sample group participants info, could be fetched from backend later
const groupParticipants = [
  { id: 1, name: "Alice", avatar: "./avatar1.png", status: "Online" },
  { id: 2, name: "Bob", avatar: "./avatar2.png", status: "Offline" },
  { id: 3, name: "Charlie", avatar: "./avatar3.png", status: "Online" },
  { id: 4, name: "David", avatar: "./avatar4.png", status: "Away" },
  { id: 5, name: "Eve", avatar: "./avatar5.png", status: "Online" },
];

const Chat = () => {
  // State to toggle emoji picker visibility
  const [open, setOpen] = useState(false);
  // State for the message input field text
  const [text, setText] = useState("");
  // State to store messages; initializes from localStorage if available
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  // State to control group info modal visibility
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // Theme state to toggle light/dark mode
  const [theme, setTheme] = useState("light");

  // References used to scroll chat to the bottom on new messages
  const endRef = useRef(null);
  const containerRef = useRef(null);

  // Simulated username for current user (can be dynamic)
  const username = "Rojan";

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    if (endRef.current && containerRef.current) {
      containerRef.current.scrollTo({
        top: endRef.current.offsetTop - containerRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Listen to storage event to sync messages across browser tabs/windows
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CHAT_STORAGE_KEY) {
        const newMessages = e.newValue ? JSON.parse(e.newValue) : [];
        setMessages(newMessages);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Handles sending a text message
  const handleSend = () => {
    if (text.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text,
      type: "text",
      username,
      timestamp: new Date().toISOString(),
    };

    // Update local messages state and persist in localStorage
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
    setText("");
    setOpen(false);
  };

  // Append selected emoji to the input field text
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  // Handle sending media (image/audio) messages
  const handleSendMedia = (type, data) => {
    const newMessage = {
      id: Date.now(),
      type,
      content: data,
      username,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
  };

  // Records a 5-second audio message and sends it
  const handleRecordVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => handleSendMedia("audio", reader.result);
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Auto stop after 5 seconds
    } catch (err) {
      alert("Microphone access denied or not available.");
      console.error(err);
    }
  };

  // Modal open/close handlers
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Toggle between light and dark themes
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const groupAvatar = "./prof.png";

  return (
    <div className={`Chat ${theme}`}>
      {/* Top bar with group info and controls */}
      <div className="top">
        <div className="group-info">
          <img src={groupAvatar} alt="Group Avatar" className="group-avatar" />
          <div className="texts">
            <span className="group-name">UDM Group Chat</span>
            <p className="group-status">5 participants</p>
          </div>
        </div>
        <div className="icons top-icons">
          <i className="fas fa-phone" title="Voice Call"></i>
          <i className="fas fa-video" title="Video Call"></i>
          <i
            className="fas fa-info-circle"
            title="Group Info"
            onClick={openModal}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>

      {/* Chat messages container */}
      <div className="center" ref={containerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.username === username ? "own" : ""}`}
          >
            {/* Show avatar for other users */}
            {msg.username !== username && <img src="./avatar.png" alt="" />}
            <div className="texts">
              <div className="message-header">
                <small>{msg.username}</small>
              </div>
              {/* Render content based on message type */}
              {msg.type === "text" ? (
                <p>{msg.text}</p>
              ) : msg.type === "image" ? (
                <img
                  src={msg.content}
                  alt="media"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    height: "auto",
                    width: "auto",
                    borderRadius: "8px",
                    objectFit: "contain",
                  }}
                />
              ) : msg.type === "audio" ? (
                <audio controls src={msg.content} />
              ) : null}
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* Bottom input area for sending messages */}
      <div className="bottom">
        <div className="icons">
          {/* Upload Image */}
          <img
            src="img.png"
            alt="Upload"
            title="Upload Image"
            style={{ cursor: "pointer" }}
            onClick={() => document.getElementById("upload-image").click()}
          />
          <input
            type="file"
            accept="image/*"
            id="upload-image"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => handleSendMedia("image", reader.result);
                reader.readAsDataURL(file);
              }
            }}
          />

          {/* Take Picture with camera */}
          <img
            src="camera.png"
            alt="Camera"
            title="Take Picture"
            style={{ cursor: "pointer" }}
            onClick={() => document.getElementById("take-picture").click()}
          />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            id="take-picture"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => handleSendMedia("image", reader.result);
                reader.readAsDataURL(file);
              }
            }}
          />

          {/* Record Audio */}
          <img
            src="mic.png"
            alt="Mic"
            title="Record Voice"
            style={{ cursor: "pointer" }}
            onClick={handleRecordVoice}
          />
        </div>

        {/* Message input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* Emoji picker toggle */}
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
            style={{ cursor: "pointer" }}
          />
          <div className="picker">{open && <EmojiPicker onEmojiClick={handleEmoji} />}</div>
        </div>

        {/* Send button */}
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>

      {/* Modal displaying group info and theme toggle */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Group Info"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Group Info</h2>
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            border: "none",
            background: "transparent",
            fontSize: 24,
            cursor: "pointer",
          }}
          aria-label="Close Modal"
        >
          &times;
        </button>

        <div style={{ marginTop: 40 }}>
          <img
            src={groupAvatar}
            alt="Group Avatar"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
          />
          <h3 style={{ marginTop: 10 }}>UDM Group Chat</h3>
          <p>Participants: {groupParticipants.length}</p>

          <hr style={{ margin: "15px 0" }} />

          <div>
            <h4>Members</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {groupParticipants.map((p) => (
                <li
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    gap: 12,
                  }}
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <strong>{p.name}</strong>
                    <br />
                    <small
                      style={{
                        color:
                          p.status === "Online"
                            ? "green"
                            : p.status === "Offline"
                            ? "gray"
                            : "orange",
                        fontWeight: "600",
                      }}
                    >
                      {p.status}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            style={{
              marginTop: 20,
              padding: "8px 16px",
              borderRadius: 5,
              border: "none",
              cursor: "pointer",
              backgroundColor: theme === "light" ? "#333" : "#eee",
              color: theme === "light" ? "#fff" : "#333",
              fontWeight: "bold",
              display: "block",
            }}
            title="Toggle Light/Dark Theme"
          >
            Switch to {theme === "light" ? "Dark" : "Light"} Theme
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
