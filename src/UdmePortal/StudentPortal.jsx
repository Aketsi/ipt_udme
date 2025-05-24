import React, { useState } from 'react';
import SideBar from '../SideBar/SideBar';
import MainContent from '../MainContent/MainContent';
import ChatBar from '../ChatBar/ChatBar';
import Chat from '../Chat/Chat';
// import Announcements from '../components/Announcements/Announcements';
// import Modules from '../components/Modules/Modules';
// import Grades from '../components/Grades/Grades';
import './StudentPortal.css';

const StudentPortal = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('Home');
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Map of menu options to their components
  const menuComponentMap = {
    Home: <MainContent />,
    Messages: <Chat />,
    // Announcements: <Announcements />,
    // Modules: <Modules />,
    // Grades: <Grades />,
  };

  const handleMenuSelect = (menu) => {
    if (menuComponentMap[menu]) {
      setSelectedMenu(menu);
      setModalOpen(false);
    } else {
      setModalOpen(true);
    }
  };

  const contentToRender = menuComponentMap[selectedMenu] || <MainContent />;

  return (
    <div className="portal-main">
      {/* Top Header */}
      <div className="top-header">
        <div className="header-left">
          <img src="/assets/udmlogo.png" alt="UDM Logo" className="header-logo" />
          <span className="header-title">UNIVERSIDAD DE MANILA</span>
        </div>
        <button className="hbutton">Logout</button>
      </div>

      {/* Layout Sections */}
      <div className="portal-container">
        <section className={`sidebar-container ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          {/* Pass menu selection handler to SideBar */}
          <SideBar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            onSelectMenu={handleMenuSelect}
          />
        </section>

        <section className="maincontent-container">
          {contentToRender}
        </section>

        <section className="chatbar-container">
          <ChatBar />
        </section>
      </div>

      {/* Modal for unavailable features */}
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
