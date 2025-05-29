import React from "react";

const Footer = () => (
  <footer className="bg-dark text-white py-4">
    <div className="container">
      <div className="row">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="d-flex align-items-center mb-2">
            <i className="fa fa-truck text-primary me-2" style={{fontSize: '1.5rem'}} />
            <span className="fw-bold fs-5">FASTER</span>
          </div>
          <p className="text-muted mb-0">Your trusted partner in global logistics solutions.</p>
        </div>
        <div className="col-md-6 text-md-end">
          <p className="mb-0 text-muted">&copy; 2024 FASTER. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 