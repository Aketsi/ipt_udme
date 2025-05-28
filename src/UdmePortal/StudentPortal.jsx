/* Updated StudentPortal.jsx to preserve chat histories on logout */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import SideBar from '../SideBar/SideBar';
import MainContent from '../MainContent/MainContent';
import ChatBar from '../ChatBar/ChatBar';
import Chat from '../Chat/Chat';
import Modules from '../Modules/Modules';
import './StudentPortal.css';

const StudentPortal = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('Home');
  const [selectedChat, setSelectedChat] = useState('global');
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSelectChat = (chatName) => {
    setSelectedMenu('Messages');
    setSelectedChat(chatName);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      await signOut(auth);
      navigate('/'); // preserve chat histories in localStorage
    } catch (err) {
      alert("Failed to log out. Please try again.");
      console.error(err);
    }
  };

  const menuComponentMap = {
    Home: <MainContent />,
    Messages: <Chat selectedChat={selectedChat} />,
    Modules: <Modules />,
  };

  const handleMenuSelect = (menu) => {
    if (menuComponentMap[menu]) {
      setSelectedMenu(menu);
      setSelectedChat('global');
      setModalOpen(false);
    } else {
      setModalOpen(true);
    }
  };

  const contentToRender = menuComponentMap[selectedMenu] || <MainContent />;

  return (
    <div className="portal-main">
      <div className="top-header">
        <div className="header-left">
          <img src="/assets/udmlogo.png" alt="UDM Logo" className="header-logo" />
          <span className="header-title">UNIVERSIDAD DE MANILA</span>
        </div>
        <button className="hbutton" onClick={handleLogout}>Logout</button>
      </div>

      <div className="portal-container">
        <section className={`sidebar-container ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onSelectMenu={handleMenuSelect} />
        </section>

        <section className="maincontent-container">{contentToRender}</section>

        <section className="chatbar-container">
          <ChatBar onSelectChat={handleSelectChat} selectedChat={selectedChat} currentUser={currentUser} />
        </section>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Feature Coming Soon</h2>
            <p>This feature is under development and will be added soon!</p>
            <button onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
