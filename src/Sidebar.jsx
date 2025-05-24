import React from "react";
import "./StudentPortal.css";

function Sidebar({ isOpen, toggleSidebar, onSelectMenu }) {
  return (
    // Sidebar container with conditional class for collapsed state
    <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      
      {/* Button to toggle sidebar open/closed */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "<<" : ">>"}
      </button>

      {/* Render sidebar content only when open */}
      {isOpen && (
        <>
          {/* University logo and title */}
          <img src="/logo.png" alt="UDM Logo" className="logo-img" />
          <div className="logo-text">UNIVERSIDAD DE MANILA</div>

          {/* Navigation menu list */}
          <ul className="menu-list">
            {["Home", "Messages", "Modules", "Grades", "Menu"].map(
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
    </aside>
  );
}

export default Sidebar;
