import React from "react";

const Hero = () => (
  <section className="position-relative bg-dark text-white d-flex align-items-center justify-content-center flex-column" style={{height: '60vh', overflow: 'hidden'}}>
    {/* Menu Bar */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100 position-absolute top-0 start-0" style={{zIndex: 3}}>
      <div className="container-fluid px-4">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <i className="fa fa-truck text-primary me-2" style={{fontSize: '1.5rem'}} />
          <span className="fw-bold">FASTER</span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#services">Services</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    {/* Hero Image */}
    <img
      src="/hero-img.jpg"
      alt="Logistics Hero"
      className="position-absolute w-100 h-100 object-fit-cover opacity-50"
      style={{top: 0, left: 0, zIndex: 1, objectFit: 'cover', opacity: 0.6}}
    />
    <div className="position-relative text-center" style={{zIndex: 2}}>
      <h1 className="display-4 fw-bold mb-3 text-shadow">Fast, Reliable Logistics Solutions</h1>
      <p className="lead mb-4 text-shadow">Track your shipment or learn more about our services.</p>
    </div>
  </section>
);

export default Hero; 