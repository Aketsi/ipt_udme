import React, { useState } from "react";
import "./StudentPortal.css";

function ChatBar() {
  // Holds the current profile info displayed in the sidebar
  const [profile, setProfile] = useState({
    id: "23–22–003",
    name: "Jaynie Claire Q. Correa",
    status: "College Student",
  });

  // Controls visibility of the profile edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Temporary state for editing profile fields before saving
  const [tempProfile, setTempProfile] = useState(profile);

  // Open modal and initialize tempProfile with current profile data
  const openModal = () => {
    setTempProfile(profile);
    setIsModalOpen(true);
  };

  // Update tempProfile fields as user types inside modal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes from tempProfile to main profile and close modal
  const handleSave = () => {
    setProfile(tempProfile);
    setIsModalOpen(false);
  };

  // Close modal without saving changes
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Sidebar with profile info and contacts */}
      <aside className="profile-bar">
        <div className="profile-header">MY PROFILE</div>

        <div className="student-profile">
          <div className="avatar-glow"></div>
          <div className="student-info">
            <div className="student-id">
              <strong>{profile.id}</strong> <span className="online-dot" />
            </div>
            <div className="student-name">{profile.name}</div>
            <div className="student-status">
              STATUS: <span className="status-label">{profile.status}</span>
            </div>
          </div>
        </div>

        <button className="edit-button" onClick={openModal}>
          Edit Profile
        </button>

        {/* Dummy contacts list */}
        <div className="contacts">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`contact ${i === 0 ? "highlighted" : ""}`}>
              <div className="contact-avatar" />
              <div className="contact-info">
                <div className="contact-name">
                  Abdul Jabul <span className="online-dot" />
                </div>
                <div className="contact-role">GENED PROF ENGLISH</div>
                <div className="chat-now">Active now</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Profile Edit Modal */}
      {isModalOpen && (
        <div className="chatbar-modal-overlay">
          <div className="chatbar-modal-content">
            <h2>Edit Profile</h2>

            {/* Input fields bound to tempProfile state */}
            <label>
              Student ID:
              <input
                type="text"
                name="id"
                value={tempProfile.id}
                onChange={handleChange}
              />
            </label>

            <label>
              Name:
              <input
                type="text"
                name="name"
                value={tempProfile.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Status:
              <input
                type="text"
                name="status"
                value={tempProfile.status}
                onChange={handleChange}
              />
            </label>

            {/* Modal action buttons */}
            <div className="chatbar-modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBar;
