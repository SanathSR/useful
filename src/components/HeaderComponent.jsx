import React from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBContainer } from 'mdb-react-ui-kit';
const HeaderComponent = () => {
  return (
    <header className='header-container'>
      <MDBNavbar expand="lg" light bgColor="light">
        <MDBContainer>
          <MDBNavbarBrand href="/">⬅️</MDBNavbarBrand>
          
        </MDBContainer>
      </MDBNavbar>
    </header>
  );
}

export default HeaderComponent;
