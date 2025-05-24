import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatBar from "./ChatBar";
import MainContent from "./MainContent";
import Chat from "./components/chat/Chat";
import Login from "./Login";

function App() {
  // Initialize user from localStorage with validation
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("userData");
      if (!savedUser) return null;
      const parsedUser = JSON.parse(savedUser);
      // Validate parsedUser has required properties (customize as needed)
      if (!parsedUser || typeof parsedUser !== "object" || !parsedUser.id) return null;
      return parsedUser;
    } catch (err) {
      // If JSON.parse fails, clear invalid user data and return null
      localStorage.removeItem("userData");
      return null;
    }
  });

  // Sync localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userData");
    }
  }, [user]);

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const menuComponentMap = {
    Home: <MainContent />,
    Messages: <Chat />,
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

  // Login handler passed to Login component
  const handleLogin = (userData) => {
    if (userData && userData.id) {
      setUser(userData);
    } else {
      // Optionally handle invalid login data here
      console.warn("Invalid login data", userData);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
          }
        />

        {/* Main authenticated route */}
        <Route
          path="/"
          element={
            user ? (
              <div>
                <div className="top-header">
                  <div className="header-left">
                    <img
                      src="/logo.png"
                      alt="UDM Logo"
                      className="header-logo"
                    />
                    <span className="header-title">UNIVERSIDAD DE MANILA</span>
                  </div>
                  <button className="hbutton" onClick={handleLogout}>
                    Log out
                  </button>
                </div>

                <div className="portal-layout">
                  <Sidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    onSelectMenu={handleMenuSelect}
                  />

                  {contentToRender}

                  <ChatBar />
                </div>

                {isModalOpen && (
                  <div
                    className="modal-overlay"
                    onClick={() => setModalOpen(false)}
                  >
                    <div
                      className="modal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2>Feature Coming Soon</h2>
                      <p>
                        This feature is under development and will be added
                        soon!
                      </p>
                      <button onClick={() => setModalOpen(false)}>Close</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
