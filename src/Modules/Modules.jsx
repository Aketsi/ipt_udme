import React, { useState } from 'react';
import Modal from 'react-modal';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './Modules.css';

Modal.setAppElement('#root');

const Modules = () => {
  const [selectedModule, setSelectedModule] = useState(null);

    const modules = [
    {
        title: "Mathematics 101",
        coverImage: "/cover/math.png",
        pdfUrl: "/pdf/math.pdf",
    },
    {
        title: "Fundamentals of Science",
        coverImage: "/cover/science.png",
        pdfUrl: "/pdf/science.pdf",
    },
    {
        title: "Introduction to History",
        coverImage: "/cover/history.png",
        pdfUrl: "/pdf/history.pdf",
    },
    {
        title: "English Literature",
        coverImage: "/cover/english.png",
        pdfUrl: "/pdf/english.pdf",
    },
    {
        title: "Computer Basics",
        coverImage: "/cover/computer.png",
        pdfUrl: "/pdf/computer.pdf",
    },
    {
        title: "Physical Education",
        coverImage: "/cover/pe.png",
        pdfUrl: "/pdf/pe.pdf",
    },
    {
        title: "Philosophy 101",
        coverImage: "/cover/philosophy.png",
        pdfUrl: "/pdf/philosophy.pdf",
    },
    {
        title: "Economics Principles",
        coverImage: "/cover/economics.png",
        pdfUrl: "/pdf/economics.pdf",
    },
    {
        title: "Biology Basics",
        coverImage: "/cover/biology.png",
        pdfUrl: "/pdf/biology.pdf",
    },
    {
        title: "Chemistry Concepts",
        coverImage: "/cover/chemistry.png",
        pdfUrl: "/pdf/chemistry.pdf",
    },
    {
        title: "World Geography",
        coverImage: "/cover/geography.png",
        pdfUrl: "/pdf/geography.pdf",
    },
    {
        title: "Art Appreciation",
        coverImage: "/cover/art.png",
        pdfUrl: "/pdf/art.pdf",
    },
    ];


  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleModuleClick = (pdfUrl) => {
    setSelectedModule(pdfUrl);
  };

  const handleCloseModal = () => {
    setSelectedModule(null);
  };

  return (
    <div className="module-main">
    <div className="module-container">
      <header className="module-header">
        <h1>University Modules</h1>
        <p>Select a module to view its content.</p>
      </header>

      <div className="modules-wrapper">
        <div className="modules-grid">
          {modules.map((module, index) => (
            <div
              key={index}
              className="module-card"
              style={{ backgroundImage: `url(${module.coverImage})` }}
              onClick={() => handleModuleClick(module.pdfUrl)}
            >
              <div className="module-title-overlay">
                <h3>{module.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!selectedModule}
        onRequestClose={handleCloseModal}
        contentLabel="Module Viewer"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <button className="close-btn" onClick={handleCloseModal}>✖</button>
        <Worker workerUrl="/pdf-worker/pdf.worker.min.js">
          <Viewer fileUrl={selectedModule} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </Modal>
    </div>
    </div>
  );
};

export default Modules;
