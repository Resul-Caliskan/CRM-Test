import React, { useState } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
// bunu kaldırırsan pdfi açamazsın moruq
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
const PdfViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  
  const fetchPdf = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/getcv`,
        { filename: "bitirme.pdf" },
        { responseType: "arraybuffer" }
      );

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } catch (error) {
      console.error("PDF alınırken hata oluştu:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <button className="absolute top-0" onClick={fetchPdf}>PDF Al</button>
      {pdfUrl && (
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      )}
    </div>
  );
};
export default PdfViewer;