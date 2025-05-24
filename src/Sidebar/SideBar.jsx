import React, { useState } from 'react';
import "./SideBar.css"; // Importing CSS for styling


function SideBar({ isOpen, toggleSidebar, onSelectMenu }) {
  return (
    // Sidebar container with conditional class for collapsed state
    <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      
      {/* Button to toggle sidebar open/closed */}
    <div className={`sidebar-toggle ${isOpen ? "open" : ""}`} onClick={toggleSidebar}>
      <div className="bar bar1"></div>
      <div className="bar bar2"></div>
      <div className="bar bar3"></div>
    </div>


      {/* Render sidebar content only when open */}
      {isOpen && (
        <>
          {/* University logo and title */}
          <img src="/assets/wavy.png" alt="wavy" className='wavy-lines' />
          <img src="/assets/udmlogo.png" alt="UDM Logo" className="logo-img" />
          <div className="logo-text">UNIVERSIDAD DE MANILA</div>

          <div className="logo-menu">MENU</div>

          {/* Navigation menu list */}
          <ul className="menu-list">
            {["Home", "Messages", "Modules", "Grades"].map(
              (item) => (
                // Each menu item triggers onSelectMenu callback with item name
                <li key={item} onClick={() => onSelectMenu(item)}>
                  {item}
                </li>
              )
            )}
          </ul>
        </>
      )}

      {/* Footer with copyright notice */}
      <div className="sidebar-footer">
        <div className="footer-container">
          <img src="/assets/udm-footer.png" alt="udmfoot" />
          <img src="/assets/IT-footer.png" alt="itfooter" />
        </div>
        <p>© 2025 Universidad de Manila</p>
        <p>All rights reserved.</p>
      </div>
    </aside>
  );
}

export default SideBar;