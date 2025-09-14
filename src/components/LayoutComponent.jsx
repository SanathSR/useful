import React from 'react';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';
import '../styling/LayoutComponent.css';

const LayoutComponent = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <header className="layout-header">
        <HeaderComponent />
      </header>

      <main className="layout-content">
        {children}
      </main>

      <footer className="layout-footer">
        <FooterComponent />
      </footer>
    </div>
  );
};

export default LayoutComponent;
