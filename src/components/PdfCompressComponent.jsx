import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBSpinner,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBValidation,
  MDBValidationItem,
} from 'mdb-react-ui-kit';

const PdfCompressComponent = () => {
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetSizeKB, setTargetSizeKB] = useState(100); // default target 100 KB

  const fileInputRef = useRef();

  const handlePdfUpload = async (event) => {
    setError('');
    setCompressedBlob(null);
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setOriginalFile(file);
    setLoading(true);

    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);

      // Optionally remove metadata to save some bytes
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');

      // Save compressed PDF
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
      const compressed = new Blob([compressedBytes], { type: 'application/pdf' });

      if (compressed.size > targetSizeKB * 1024) {
        setError(
          `Could not compress below ${targetSizeKB} KB. Compressed size is ${(compressed.size / 1024).toFixed(2)} KB. Try a higher value.`
        );
        setCompressedBlob(compressed);
      } else {
        setError('');
        setCompressedBlob(compressed);
      }
    } catch (err) {
      console.error(err);
      setError('PDF compression failed.');
      setCompressedBlob(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadCompressedPdf = () => {
    if (!compressedBlob || !originalFile) return;

    const fileNameParts = originalFile.name.split('.');
    const ext = fileNameParts.pop();
    const baseName = fileNameParts.join('.');
    saveAs(compressedBlob, `${baseName}-compressed.${ext}`);
  };

  const resetAll = () => {
    setOriginalFile(null);
    setCompressedBlob(null);
    setError('');
    setLoading(false);
    setTargetSizeKB(100);
    fileInputRef.current.value = '';
  };

  const handleTargetSizeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (val > 1) {
      setTargetSizeKB(val);
      setError('');
    } else {
      setError('Target size must be greater than 1 KB');
    }
  };

  return (
    <MDBContainer className="py-5 d-flex justify-content-center">
      <MDBCard style={{ maxWidth: '600px', width: '100%' }} className="shadow-3">
        <MDBCardBody>
          <MDBCardTitle className="text-center mb-4">📄 Compress PDF</MDBCardTitle>

          <div className="mb-3">
            <label htmlFor="targetSize" className="form-label">
              Target Max Size (KB):
            </label>
            <input
              type="number"
              id="targetSize"
              className="form-control"
              value={targetSizeKB}
              min="2"
              onChange={handleTargetSizeChange}
              disabled={loading}
            />
          </div>

          <div className="text-center mb-3">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
              disabled={loading}
            />
            <MDBBtn onClick={() => fileInputRef.current.click()} color="info" disabled={loading}>
              Select PDF File
            </MDBBtn>
          </div>

          <MDBRow className="mt-2 g-2">
            <MDBCol>
              <MDBBtn
                color="primary"
                onClick={downloadCompressedPdf}
                disabled={!compressedBlob || loading}
                block
              >
                Download
              </MDBBtn>
            </MDBCol>
            <MDBCol>
              <MDBBtn color="secondary" onClick={resetAll} block disabled={loading}>
                Reset
              </MDBBtn>
            </MDBCol>
          </MDBRow>

          {loading && (
            <div className="text-center my-3">
              <MDBSpinner role="status" />
              <p className="mt-2">Compressing PDF...</p>
            </div>
          )}

          {error && <p className="text-danger text-center mt-3">{error}</p>}

          {originalFile && !loading && (
            <p className="mt-3 text-center">
              <strong>Original:</strong> {(originalFile.size / 1024).toFixed(2)} KB — {originalFile.name}
            </p>
          )}

          {compressedBlob && !loading && (
            <p className="text-center mt-2">
              <strong>Compressed Size:</strong> {(compressedBlob.size / 1024).toFixed(2)} KB
            </p>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default PdfCompressComponent;
