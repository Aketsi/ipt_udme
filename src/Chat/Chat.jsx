/* Updated Chat.jsx to dynamically display contact names and roles */

import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import EmojiPicker from "emoji-picker-react";
import "./Chat.css";

Modal.setAppElement("#root");

const Chat = ({ selectedChat, currentUser }) => {
  const STORAGE_KEY = `${selectedChat}GroupChatMessages`;

  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const endRef = useRef(null);
  const containerRef = useRef(null);

  const username = currentUser?.email || "Guest";

  const contacts = [
    { id: "Contact1", name: "XXXXX", role: "GENED PROF ENGLISH" },
    { id: "Contact2", name: "YYYYY", role: "MATH COORDINATOR" },
    { id: "Contact3", name: "ZZZZZ", role: "SCIENCE PROFESSOR" },
  ];

  const activeContact = contacts.find((c) => c.id === selectedChat);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setMessages(saved ? JSON.parse(saved) : []);
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (endRef.current && containerRef.current) {
      containerRef.current.scrollTo({
        top: endRef.current.offsetTop - containerRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        const newMessages = e.newValue ? JSON.parse(e.newValue) : [];
        setMessages(newMessages);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [STORAGE_KEY]);

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

  return (
    <div className={`Chat ${theme}`}>
      <div className="top">
        <div className="group-info">
          <img src="./prof.png" alt="Group Avatar" className="group-avatar" />
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
          <div key={msg.id} className={`message ${msg.sender === username ? "own" : ""}`}>
            {msg.sender !== username && <img src="./avatar.png" alt="" />}
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
          <i className="fas fa-smile" onClick={() => setOpenEmoji((prev) => !prev)}></i>
          <div className="picker">{openEmoji && <EmojiPicker onEmojiClick={handleEmojiClick} />}</div>
        </div>
        <button className="sendButton" onClick={handleSend}>Send</button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="Modal" overlayClassName="Overlay">
        <h2>{selectedChat === "global" ? "Global Chat Info" : activeContact ? activeContact.name : "Contact Info"}</h2>
        <button onClick={closeModal}>&times;</button>
        <button onClick={toggleTheme}>Switch to {theme === "light" ? "Dark" : "Light"} Theme</button>
      </Modal>
    </div>
  );
};

export default Chat;
