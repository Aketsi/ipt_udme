import React, { useState } from "react";
import "./ChatBar.css";

function ChatBar() {
  const [profile, setProfile] = useState({
    id: "23–22–003",
    name: "Jaynie Claire Q. Correa",
    status: "College Student",
    pic: null, // start with no profile pic or default pic url
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [tempPicPreview, setTempPicPreview] = useState(profile.pic); // for previewing uploaded pic

  const openModal = () => {
    setTempProfile(profile);
    setTempPicPreview(profile.pic);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change to preview image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPicPreview(reader.result); // base64 image string
      };
      reader.readAsDataURL(file);
    }
  };

  // Save all changes including profile pic
  const handleSave = () => {
    setProfile({ ...tempProfile, pic: tempPicPreview });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <aside className="profile-bar">
        <div className="profile-header">MY PROFILE</div>

        <div className="student-profile">
          {/* Show selected pic or fallback */}
          <div
            className="avatar-glow"
            style={{
              backgroundImage: tempPicPreview
                ? `url(${tempPicPreview})`
                : `url('/default-avatar.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              marginBottom: "12px",
            }}
          />
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

      {isModalOpen && (
        <div className="chatbar-modal-overlay">
          <div className="chatbar-modal-content">
            <h2>Edit Profile</h2>

            <label>
              Student ID:
              <input
                type="text"
                name="id"
                value={tempProfile.id}
                onChange={handleChange}
                disabled
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

            <label>
              Select Profile Picture:
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>

            {/* Preview selected pic */}
            {tempPicPreview && (
              <div
                style={{
                  marginTop: "10px",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundImage: `url(${tempPicPreview})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "2px solid #006747",
                }}
              />
            )}

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
