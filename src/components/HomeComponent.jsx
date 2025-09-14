import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import FooterComponent from './FooterComponent'; 

const HomeComponent = () => {
  const navigate = useNavigate();

  const cards = [
    { title: '🖼️ Image Compress', route: '/imagecompress' },
    // { title: '🖼️ Image Join', route: '/imagejoin' },
    { title: '📄 PDF Compress', route: '/pdfcompress' },
    { title: '🖼️➔📄 Image to PDF', route: '/imagetopdf' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Main content */}
      <MDBContainer className="flex-grow-1 d-flex flex-column justify-content-center py-5">
        <h2 className="text-center mb-4 text-dark">Welcome</h2>
        <MDBRow className="g-4 justify-content-center">
          {cards.map((card, idx) => (
            <MDBCol key={idx} lg="3" md="4" sm="6" xs="10">
              <MDBCard
                className="h-100 shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(card.route)}
              >
                <MDBCardBody className="text-center">
                  <MDBCardTitle className="fs-5 fw-bold">{card.title}</MDBCardTitle>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      </MDBContainer>

      {/* Footer */}
      <FooterComponent />
    </div>
  );
};

export default HomeComponent;
