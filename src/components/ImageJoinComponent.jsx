import React, { useState, useRef } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBSpinner,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';

const ImageJoinComponent = () => {
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState('horizontal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [finalImage, setFinalImage] = useState(null);
  const fileInputRef = useRef();

  // Handle the image file upload
  const handleImageUpload = (event) => {
    setError('');
    const files = Array.from(event.target.files);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    const validFiles = files.filter((file) => validTypes.includes(file.type));
    if (validFiles.length !== files.length) {
      setError('Only JPG and PNG images are allowed.');
      return;
    }

    const newImages = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      orientation: 0, // Initially no rotation
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Rotate an image by 90 degrees
  const rotateImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index].orientation += 90;
      if (updatedImages[index].orientation === 360) {
        updatedImages[index].orientation = 0;
      }
      return updatedImages;
    });
  };

  // Join the images horizontally or vertically based on user selection
  const joinImages = async () => {
    if (images.length < 2) {
      setError('Please upload at least two images.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const imgElements = await Promise.all(
        images.map(
          (imgObj) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.src = imgObj.url;
              img.onload = () => resolve({ img, orientation: imgObj.orientation });
              img.onerror = (err) => reject(err);
            })
        )
      );

      // Determine the total width and height based on orientation
      let totalWidth = 0;
      let totalHeight = 0;

      if (orientation === 'horizontal') {
        totalWidth = imgElements.reduce((acc, { img }) => acc + img.width, 0);
        totalHeight = Math.max(...imgElements.map(({ img }) => img.height));
      } else {
        totalWidth = Math.max(...imgElements.map(({ img }) => img.width));
        totalHeight = imgElements.reduce((acc, { img }) => acc + img.height, 0);
      }

      // Create a canvas to join the images
      const canvas = document.createElement('canvas');
      canvas.width = totalWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext('2d');

      let offsetX = 0;
      let offsetY = 0;

      imgElements.forEach(({ img, orientation }) => {
        const rotatedCanvas = rotateImageCanvas(img, orientation);
        const rotatedImg = rotatedCanvas;

        if (orientation === 'horizontal') {
          ctx.drawImage(rotatedImg, offsetX, 0, img.width, img.height);
          offsetX += img.width;
        } else {
          ctx.drawImage(rotatedImg, 0, offsetY, img.width, img.height);
          offsetY += img.height;
        }
      });

      setFinalImage(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error(err);
      setError('Failed to join images.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to rotate image on a canvas
  const rotateImageCanvas = (img, angle) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const radianAngle = (angle * Math.PI) / 180;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radianAngle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(img, 0, 0);

    return canvas;
  };

  // Reset the component to its initial state
  const resetAll = () => {
    setImages([]);
    setError('');
    setLoading(false);
    setFinalImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <MDBContainer className="py-5 d-flex justify-content-center">
      <MDBCard style={{ maxWidth: '800px', width: '100%' }} className="shadow-3">
        <MDBCardBody>
          <MDBCardTitle className="text-center mb-4">🖼️ Join Images</MDBCardTitle>

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
                <div key={idx} style={{ position: 'relative', marginBottom: '20px' }}>
                  <img
                    src={img.url}
                    alt={`upload-${idx}`}
                    style={{
                      width: 250,
                      height: 250,
                      objectFit: 'cover',
                      borderRadius: 8,
                      transform: `rotate(${img.orientation}deg)`,
                    }}
                  />
                  <MDBBtn
                    color="warning"
                    size="sm"
                    style={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={() => rotateImage(idx)}
                  >
                    Rotate
                  </MDBBtn>
                </div>
              ))}
            </div>
          )}

          {/* General Select dropdown for horizontal or vertical */}
          <div className="mb-3">
            <label htmlFor="orientationSelect" className="form-label">
              Join Images Horizontally or Vertically?
            </label>
            <select
              id="orientationSelect"
              className="form-select"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>

          <MDBRow className="g-2">
            <MDBCol>
              <MDBBtn
                color="primary"
                onClick={joinImages}
                disabled={loading || images.length < 2}
                block
              >
                Join Images
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
              <p className="mt-2">Joining images...</p>
            </div>
          )}

          {error && <p className="text-danger text-center mt-3">{error}</p>}

          {finalImage && !loading && (
            <div className="text-center mt-3">
              <h5>Final Image</h5>
              <img
                src={finalImage}
                alt="Final Joined"
                style={{ width: '100%', maxWidth: '500px', marginBottom: '20px' }}
              />
              <MDBBtn color="success" onClick={() => {
                const link = document.createElement('a');
                link.href = finalImage;
                link.download = 'joined-image.png';
                link.click();
              }}>
                Download Joined Image
              </MDBBtn>
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default ImageJoinComponent;
