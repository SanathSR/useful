import React, { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBSpinner,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';

const ImageUploadAndCompressComponent = () => {
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetSizeKB, setTargetSizeKB] = useState(100); // default to 100KB

  const fileInputRef = useRef();

  const handleImageUpload = async (event) => {
    setError('');
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG image.');
      return;
    }

    setOriginalFile(file);
    setCompressedFile(null);

    try {
      setLoading(true);

      const options = {
        maxSizeMB: targetSizeKB / 1024, // convert KB to MB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        maxIteration: 10,
      };

      const compressedBlob = await imageCompression(file, options);

      if (compressedBlob.size > targetSizeKB * 1024) {
        setError(`Could not compress below ${targetSizeKB}KB. Try a smaller image or higher size.`);
        setCompressedFile(null);
      } else {
        setCompressedFile(compressedBlob);
      }
    } catch (err) {
      console.error(err);
      setError('Compression failed, please try again.');
      setCompressedFile(null);
    } finally {
      setLoading(false);
    }
  };

  const getCompressedImageUrl = () => {
    if (!compressedFile) return null;
    return URL.createObjectURL(compressedFile);
  };

  const downloadCompressedFile = () => {
    if (!compressedFile) return;
    const url = getCompressedImageUrl();
    const link = document.createElement('a');
    const fileNameParts = originalFile.name.split('.');
    const ext = fileNameParts.pop();
    const baseName = fileNameParts.join('.');
    link.download = `${baseName}-compressed.${ext}`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setOriginalFile(null);
    setCompressedFile(null);
    setError('');
    setLoading(false);
    fileInputRef.current.value = '';
  };

  return (
    <MDBContainer className="py-5 d-flex justify-content-center">
      <MDBCard style={{ maxWidth: '600px', width: '100%' }} className="shadow-3">
        <MDBCardBody>
          <MDBCardTitle className="text-center mb-4">🖼️ Compress Image (Custom Size)</MDBCardTitle>

          <MDBInput
            label="Target size (in KB)"
            type="number"
            min={1}
            value={targetSizeKB}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1) {
                setTargetSizeKB(value);
              } else {
                setTargetSizeKB(1);
              }
            }}
            className="mb-3"
          />

          <div className="text-center mb-3">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <MDBBtn onClick={() => fileInputRef.current.click()} color="info">
              Select Image
            </MDBBtn>
          </div>

          <MDBRow className="mt-2 g-2">
            <MDBCol>
              <MDBBtn
                color="primary"
                onClick={downloadCompressedFile}
                disabled={!compressedFile}
                block
              >
                Download
              </MDBBtn>
            </MDBCol>
            <MDBCol>
              <MDBBtn color="secondary" onClick={resetAll} block>
                Reset
              </MDBBtn>
            </MDBCol>
          </MDBRow>

          {loading && (
            <div className="text-center my-3">
              <MDBSpinner role="status" />
              <p className="mt-2">Compressing...</p>
            </div>
          )}

          {error && <p className="text-danger text-center mt-3">{error}</p>}

          {originalFile && !loading && (
            <p className="mt-3 text-center">
              <strong>Original:</strong> {(originalFile.size / 1024).toFixed(2)} KB — {originalFile.name}
            </p>
          )}

          {compressedFile && !loading && (
            <div className="text-center mt-3">
              <p><strong>Compressed:</strong> {(compressedFile.size / 1024).toFixed(2)} KB</p>
              <img
                src={getCompressedImageUrl()}
                alt="Compressed Preview"
                className="img-fluid rounded"
                style={{ maxHeight: '250px' }}
              />
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default ImageUploadAndCompressComponent;
