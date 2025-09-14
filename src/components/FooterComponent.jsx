import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import '../styling/Footer.css'; // You can add custom styles for the footer

const FooterComponent = () => {
  return (
    <footer className="footer-container">
      <MDBContainer className="py-0">
        <MDBRow>
          <MDBCol className="text-center ">
            <p className="mb-0">
              © {new Date().getFullYear()} Owned and Developed by Sanath. All rights reserved.
            </p>
          </MDBCol>
          
        </MDBRow>
      </MDBContainer>
    </footer>
  );
}

export default FooterComponent;
