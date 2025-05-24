import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import EmojiPicker from "emoji-picker-react";
import "./Chat.css";

Modal.setAppElement("#root");

// Key for localStorage persistence
const CHAT_STORAGE_KEY = "globalGroupChatMessages";

// Sample participants (replace avatars with real URLs or imports)
const groupParticipants = [
  { id: 1, name: "Alice", avatar: "./avatar.png", status: "Online" },
  { id: 2, name: "Bob", avatar: "./avatar.png", status: "Offline" },
  { id: 3, name: "Charlie", avatar: "./avatar.png", status: "Online" },
  { id: 4, name: "David", avatar: "./avatar.png", status: "Away" },
  { id: 5, name: "Eve", avatar: "./avatar.png", status: "Online" },
];

const Chat = () => {
  // Emoji picker open state
  const [openEmoji, setOpenEmoji] = useState(false);
  // Text input value
  const [text, setText] = useState("");
  // Messages list, loaded from localStorage initially
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  // Modal visibility for group info
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // Theme toggle: "light" or "dark"
  const [theme, setTheme] = useState("light");

  // Refs for scrolling chat to bottom
  const endRef = useRef(null);
  const containerRef = useRef(null);

  // Current user name (can be dynamic)
  const username = "Rojan";

  // Scroll to bottom on messages change
  useEffect(() => {
    if (endRef.current && containerRef.current) {
      containerRef.current.scrollTo({
        top: endRef.current.offsetTop - containerRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Sync messages across tabs/windows via storage event
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

  // Send text message
  const handleSend = () => {
    if (text.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text,
      type: "text",
      username,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
    setText("");
    setOpenEmoji(false);
  };

  // Append emoji to input text
  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setOpenEmoji(false);
  };

  // Send media message (image/audio)
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

  // Record a 5-second voice message
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
      setTimeout(() => mediaRecorder.stop(), 5000); // Stop after 5 sec
    } catch (err) {
      alert("Microphone access denied or not available.");
      console.error(err);
    }
  };

  // Handle image upload or camera capture
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleSendMedia("image", reader.result);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be uploaded again if needed
    e.target.value = null;
  };

  // Modal open/close handlers
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Toggle light/dark theme
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const groupAvatar = "./prof.png";

  return (
    <div className={`Chat ${theme}`}>
      {/* Top bar */}
      <div className="top">
        <div className="group-info">
          <img src={groupAvatar} alt="Group Avatar" className="group-avatar" />
          <div className="texts">
            <span className="group-name">UDM Group Chat</span>
            <p className="group-status">{groupParticipants.length} participants</p>
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

      {/* Messages container */}
      <div className="center" ref={containerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.username === username ? "own" : ""}`}>
            {msg.username !== username && <img src="./avatar.png" alt="" />}
            <div className="texts">
              <div className="message-header">
                <small>{msg.username}</small>
              </div>
              {msg.type === "text" && <p>{msg.text}</p>}
              {msg.type === "image" && (
                <img
                  src={msg.content}
                  alt="media"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    borderRadius: 8,
                    objectFit: "contain",
                  }}
                />
              )}
              {msg.type === "audio" && <audio controls src={msg.content} />}
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* Bottom input area */}
      <div className="bottom">
        <div className="icons">
          {/* Upload Image */}
          <label htmlFor="upload-image">
            <i
              className="fas fa-image"
              title="Upload Image"
              style={{ cursor: "pointer", fontSize: 20, marginRight: 10 }}
            ></i>
          </label>
          <input
            type="file"
            accept="image/*"
            id="upload-image"
            style={{ display: "none" }}
            onChange={handleUpload}
          />

          {/* Take Picture with Camera */}
          <label htmlFor="take-picture">
            <i
              className="fas fa-camera"
              title="Take Picture"
              style={{ cursor: "pointer", fontSize: 20, marginRight: 10 }}
            ></i>
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            id="take-picture"
            style={{ display: "none" }}
            onChange={handleUpload}
          />

          {/* Record Voice */}
          <i
            className="fas fa-microphone"
            title="Record Voice"
            style={{ cursor: "pointer", fontSize: 20, marginRight: 10 }}
            onClick={handleRecordVoice}
          ></i>
        </div>

        {/* Text input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* Emoji Picker */}
        <div className="emoji">
          <i
            className="fas fa-smile"
            title="Emoji"
            onClick={() => setOpenEmoji((prev) => !prev)}
            style={{ cursor: "pointer", fontSize: 20, marginRight: 10 }}
          ></i>
          <div className="picker">{openEmoji && <EmojiPicker onEmojiClick={handleEmojiClick} />}</div>
        </div>

        {/* Send button */}
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>

      {/* Modal with group info and theme toggle */}
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
                        fontWeight: 600,
                      }}
                    >
                      {p.status}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              marginTop: 20,
              padding: "8px 16px",
              borderRadius: 5,
              border: "none",
              cursor: "pointer",
              outline: theme === "light" ? "#333" : "#eee",
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
