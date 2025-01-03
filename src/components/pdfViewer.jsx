import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page } from 'react-pdf';

const PdfViewer = ({ pdfLink }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const response = await axios.get(pdfLink, { responseType: 'arraybuffer' });
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          const pdfData = new Uint8Array(e.target.result);
          setNumPages(pdfData.length);
        };
        fileReader.readAsArrayBuffer(new Blob([response.data]));
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    loadPdf();
  }, [pdfLink]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePreviousPage = () => {
    setPageNumber(Math.max(1, pageNumber - 1));
  };

  const handleNextPage = () => {
    setPageNumber(Math.min(numPages, pageNumber + 1));
  };

  return (
    <div>
      <Document
        file={pdfLink}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>

      <div>
        <button onClick={handlePreviousPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <span>
          {pageNumber} / {numPages}
        </span>
        <button onClick={handleNextPage} disabled={pageNumber >= numPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;