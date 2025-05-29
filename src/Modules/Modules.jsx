import React, { useState } from 'react';
import Modal from 'react-modal';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './Modules.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js`;

Modal.setAppElement('#root');

const Modules = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const modules = [
    {
      title: "Mathematics 101",
      coverImage: "/cover/math.png",
      pdfUrl: "https://www.mathsisfun.com/geometry/pdf/Geometry.pdf",
    },
    {
      title: "Fundamentals of Science",
      coverImage: "/cover/science.png",
      pdfUrl: "https://www.nasa.gov/pdf/158162main_Science_Exploration.pdf",
    },
    {
      title: "Introduction to History",
      coverImage: "/cover/history.png",
      pdfUrl: "https://www.gutenberg.org/files/51499/51499-pdf.pdf",
    },
    {
      title: "English Literature",
      coverImage: "/cover/english.png",
      pdfUrl: "https://www.gutenberg.org/files/1342/1342-pdf.pdf",
    },
    {
      title: "Computer Basics",
      coverImage: "/cover/computer.png",
      pdfUrl: "https://cs.stanford.edu/people/eroberts/courses/soco/projects/1998-99/100book.pdf",
    },
    {
      title: "Physical Education",
      coverImage: "/cover/pe.png",
      pdfUrl: "https://www.pecentral.org/downloads/fitnessgram/fitnessgram_pdf_2010.pdf",
    },
    {
      title: "Philosophy 101",
      coverImage: "/cover/philosophy.png",
      pdfUrl: "https://www.gutenberg.org/files/49915/49915-pdf.pdf",
    },
    {
      title: "Economics Principles",
      coverImage: "/cover/economics.png",
      pdfUrl: "https://www.gutenberg.org/files/33073/33073-pdf.pdf",
    },
    {
      title: "Biology Basics",
      coverImage: "/cover/biology.png",
      pdfUrl: "https://www.ncbi.nlm.nih.gov/books/NBK22266/pdf/Bookshelf_NBK22266.pdf",
    },
    {
      title: "Chemistry Concepts",
      coverImage: "/cover/chemistry.png",
      pdfUrl: "https://chem.libretexts.org/@api/deki/files/116049/General_Chemistry_Liberty_University.pdf",
    },
    {
      title: "World Geography",
      coverImage: "/cover/geography.png",
      pdfUrl: "https://geographyfieldwork.com/WorldGeography.pdf",
    },
    {
      title: "Art Appreciation",
      coverImage: "/cover/art.png",
      pdfUrl: "https://www.metmuseum.org/-/media/Files/Education/Downloads/Teaching-Art-Appreciation.pdf",
    },
  ];

  const handleModuleClick = (pdfUrl) => {
    setSelectedModule(pdfUrl);
    setPageNumber(1); // Reset page to 1 when opening
  };

  const handleCloseModal = () => {
    setSelectedModule(null);
    setNumPages(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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
          {selectedModule && (
            <>
              <Document
                file={selectedModule}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<p>Loading PDF...</p>}
              >
                <Page pageNumber={pageNumber} />
              </Document>
              <div className="pagination-controls">
                <button
                  onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                >
                  ◀ Previous
                </button>
                <span>
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                  disabled={pageNumber >= numPages}
                >
                  Next ▶
                </button>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Modules;
