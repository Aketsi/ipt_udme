import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import EmojiPicker from "emoji-picker-react";
import "./Chat.css";

Modal.setAppElement("#root");

const Chat = ({ selectedChat, currentUser }) => {
  const STORAGE_KEY = `${selectedChat}GroupChatMessages`;
  const STORAGE_AVATAR_KEY = `${selectedChat}GroupChatAvatar`;

  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  // Initialize groupAvatar as null, will be set in useEffect
  const [groupAvatar, setGroupAvatar] = useState(null);

  const endRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const username = currentUser?.email || "Guest";

  const contacts = [
    {
      id: "Contact1",
      name: "Juan Totre",
      role: "GENED PROF ENGLISH",
      avatar: "/assets/avatar1.png",
    },
    {
      id: "Contact2",
      name: "Alberto Roberto",
      role: "MATH COORDINATOR",
      avatar: "/assets/avatar2.png",
    },
    {
      id: "Contact3",
      name: "Jopay Kamustakana",
      role: "SCIENCE PROFESSOR",
      avatar: "/assets/avatar3.png",
    },
  ];

  const activeContact = contacts.find((c) => c.id === selectedChat);

  const getAvatar = (sender) => {
    if (sender === username) return "./your-avatar.png"; // Optional: set your own avatar
    const contact = contacts.find(
      (c) => c.name === sender || c.id === sender || c.email === sender
    );
    return contact?.avatar || "./default-avatar.png";
  };

  // Load messages when selectedChat changes
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setMessages(saved ? JSON.parse(saved) : []);
  }, [STORAGE_KEY]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (endRef.current && containerRef.current) {
      containerRef.current.scrollTo({
        top: endRef.current.offsetTop - containerRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Sync avatar from localStorage on mount and when selectedChat changes
  useEffect(() => {
    const savedAvatar = localStorage.getItem(STORAGE_AVATAR_KEY);
    if (savedAvatar) {
      setGroupAvatar(savedAvatar);
    } else {
      setGroupAvatar(
        selectedChat === "global"
          ? "./assets/global-avatar.png"
          : "./default-avatar.png"
      );
    }
  }, [selectedChat, STORAGE_AVATAR_KEY]);

  // Listen to localStorage changes across tabs/windows
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        const newMessages = e.newValue ? JSON.parse(e.newValue) : [];
        setMessages(newMessages);
      }
      if (e.key === STORAGE_AVATAR_KEY) {
        setGroupAvatar(
          e.newValue ||
            (selectedChat === "global"
              ? "./assets/global-avatar.png"
              : "./default-avatar.png")
        );
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [STORAGE_KEY, STORAGE_AVATAR_KEY, selectedChat]);

  const handleSend = () => {
    if (text.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      text,
      type: "text",
      sender: username,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    setText("");
    setOpenEmoji(false);
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setOpenEmoji(false);
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Handle group avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setGroupAvatar(reader.result);
      localStorage.setItem(STORAGE_AVATAR_KEY, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className={`Chat ${theme}`}>
      <div className="top">
        <div className="group-info">
          <img src={groupAvatar} alt="Group Avatar" className="group-avatar" />
          <div className="texts">
            <span className="group-name">
              {selectedChat === "global"
                ? "Global Chat"
                : activeContact
                ? `${activeContact.name} - ${activeContact.role}`
                : "Unknown Contact"}
            </span>
          </div>
        </div>
        <div className="icons top-icons">
          <i className="fas fa-info-circle" onClick={openModal}></i>
        </div>
      </div>

      <div className="center" ref={containerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender === username ? "own" : ""}`}
          >
            {msg.sender !== username && <img src={getAvatar(msg.sender)} alt="Avatar" />}
            <div className="texts">
              <div className="message-header">
                <small>{msg.sender}</small>
              </div>
              <p>{msg.text}</p>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <div className="emoji">
          <i
            className="fas fa-smile"
            onClick={() => setOpenEmoji((prev) => !prev)}
          ></i>
          <div className="picker">{openEmoji && <EmojiPicker onEmojiClick={handleEmojiClick} />}</div>
        </div>
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="Modal messenger-modal"
        overlayClassName="Overlay"
      >
        <div className="modal-header">
          <h2>{selectedChat === "global" ? "Global Chat Info" : activeContact?.name || "Contact Info"}</h2>
          <button className="modal-close" onClick={closeModal}>
            &times;
          </button>
        </div>

        <div className="modal-avatar-section">
          <img src={groupAvatar} alt="Group Avatar" className="modal-avatar" />
          <button className="change-avatar-btn" onClick={triggerFileInput}>
            Change Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>

        <button className="theme-toggle-btn" onClick={toggleTheme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Theme
        </button>

        {selectedChat === "global" && (
          <div className="global-members">
            <h3>Participants</h3>
            <ul>
              {contacts.map((c) => (
                <li key={c.id}>
                  <img src={c.avatar} alt="Avatar" className="modal-avatar" />
                  <span>{c.name}</span> - <small>{c.role}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Chat;
