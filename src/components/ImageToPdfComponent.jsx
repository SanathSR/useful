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
} from 'mdb-react-ui-kit';

const ImageToPdfComponent = () => {
  const [images, setImages] = useState([]); // { file, url }
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const MAX_IMAGES = 20; // Maximum number of images

  // Handle multiple image upload with limit
  const handleImageUpload = (event) => {
    setError('');
    const files = Array.from(event.target.files);

    if (files.length + images.length > MAX_IMAGES) {
      setError(`You can upload up to ${MAX_IMAGES} images only.`);
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    const validFiles = files.filter((file) => validTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      setError('Only JPG and PNG images are allowed.');
    }

    const newImages = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  // Convert images to PDF
  const convertToPdf = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgObj of images) {
        const imgBytes = await imgObj.file.arrayBuffer();

        let img;
        if (imgObj.file.type === 'image/png') {
          img = await pdfDoc.embedPng(imgBytes);
        } else {
          img = await pdfDoc.embedJpg(imgBytes);
        }

        const page = pdfDoc.addPage();
        const { width, height } = img.scale(1);

        // Fit image to page size (A4 approx 595 x 842 pts), keeping aspect ratio
        const maxWidth = 595;
        const maxHeight = 842;
        let scaledWidth = width;
        let scaledHeight = height;

        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const scale = Math.min(widthRatio, heightRatio);
          scaledWidth = width * scale;
          scaledHeight = height * scale;
        }

        page.setSize(scaledWidth, scaledHeight);

        page.drawImage(img, {
          x: 0,
          y: 0,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(pdfBlob, 'images-converted.pdf');
    } catch (err) {
      console.error(err);
      setError('Failed to convert images to PDF.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setError('');
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <MDBContainer className="py-5 d-flex justify-content-center">
      <MDBCard style={{ maxWidth: '700px', width: '100%' }} className="shadow-3">
        <MDBCardBody>
          <MDBCardTitle className="text-center mb-4">🖼️➔📄 Image to PDF</MDBCardTitle>

          <div className="text-center mb-3">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              multiple
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
              disabled={loading}
            />
            <MDBBtn
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              color="info"
              disabled={loading}
            >
              Select Images
            </MDBBtn>
          </div>

          {images.length > 0 && (
            <div className="mb-3 d-flex flex-wrap justify-content-center gap-3">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`upload-${idx}`}
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                />
              ))}
            </div>
          )}

          <MDBRow className="g-2">
            <MDBCol>
              <MDBBtn
                color="primary"
                onClick={convertToPdf}
                disabled={loading || images.length === 0}
                block
              >
                Convert to PDF
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
              <p className="mt-2">Converting images to PDF...</p>
            </div>
          )}

          {error && <p className="text-danger text-center mt-3">{error}</p>}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default ImageToPdfComponent;
