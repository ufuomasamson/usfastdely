import React from "react";

const AboutUs = () => (
  <section className="py-5 bg-white">
    <div className="container">
      <div className="row align-items-center g-4">
        <div className="col-md-6">
          <img
            src="/about-img.jpg"
            alt="About Us"
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2 className="h3 fw-bold mb-3">About Us</h2>
          <p className="text-secondary mb-2">
            We are a leading logistics company with a passion for delivering excellence. Our team of professionals ensures your shipments are handled with care, speed, and reliability.
          </p>
          <p className="text-muted">
            With years of experience in the industry, we offer a wide range of services including express delivery, warehousing, and freight forwarding. Our mission is to make logistics simple and stress-free for you.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutUs; 