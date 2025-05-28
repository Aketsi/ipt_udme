import React, { useState, useEffect } from "react";
import "./ChatBar.css";

function ChatBar({ onSelectChat, selectedChat, currentUser }) {
  const [profile, setProfile] = useState({ id: "", name: "", status: "College Student", pic: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [tempPicPreview, setTempPicPreview] = useState(null);

  const defaultProfiles = {
    "akecchi99@yahoo.com": { id: "23-22-022", name: "John Albert Padua", status: "College Student", pic: null },
    "marlonpinpin@gmail.com": { id: "23-22-014", name: "Marlon Pinpin", status: "College Student", pic: null },
    "jobjab480@gmail.com": { id: "23-22-XXX", name: "User Undefined", status: "College Student", pic: null },
  };

  useEffect(() => {
    if (currentUser) {
      const savedProfile = localStorage.getItem(`profile_${currentUser.email}`);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setTempPicPreview(parsed.pic);
      } else if (defaultProfiles[currentUser.email]) {
        setProfile(defaultProfiles[currentUser.email]);
      } else {
        setProfile({ id: "23-22-XXX", name: currentUser.email, status: "College Student", pic: null });
      }
    }
  }, [currentUser]);

  const openModal = () => {
    setTempProfile(profile);
    setTempPicPreview(profile.pic);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempPicPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedProfile = { ...tempProfile, pic: tempPicPreview };
    setProfile(updatedProfile);
    localStorage.setItem(`profile_${currentUser.email}`, JSON.stringify(updatedProfile));
    setIsModalOpen(false);
  };

  const handleCancel = () => setIsModalOpen(false);

  const contacts = [
    { name: "XXXXX", role: "GENED PROF ENGLISH" },
    { name: "YYYYY", role: "MATH COORDINATOR" },
    { name: "ZZZZZ", role: "SCIENCE PROFESSOR" },
  ];

  return (
    <>
      <aside className="profile-bar">
        <div className="profile-header">MY PROFILE</div>
        <div className="student-profile">
          <div
            className="avatar-glow"
            style={{
              backgroundImage: profile.pic ? `url(${profile.pic})` : `url('/default-avatar.png')`,
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

        <button className="edit-button" onClick={openModal}>Edit Profile</button>

        <div className="contacts">
          {contacts.map((contact, i) => (
            <div
              key={i}
              className={`contact ${selectedChat === `Contact${i + 1}` ? "highlighted" : ""}`}
              onClick={() => onSelectChat(`Contact${i + 1}`)}
            >
              <div className="contact-avatar" />
              <div className="contact-info">
                <div className="contact-name">{contact.name} <span className="online-dot" /></div>
                <div className="contact-role">{contact.role}</div>
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
              <input type="text" name="id" value={tempProfile.id} onChange={handleChange} />
            </label>
            <label>
              Name:
              <input type="text" name="name" value={tempProfile.name} onChange={handleChange} />
            </label>
            <label>
              Status:
              <input type="text" name="status" value={tempProfile.status} onChange={handleChange} />
            </label>
            <label>
              Select Profile Picture:
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
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
