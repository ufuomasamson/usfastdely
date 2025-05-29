import React from "react";

const ContactUs = () => (
  <section className="py-5 bg-white">
    <div className="container">
      <div className="row align-items-center g-4">
        <div className="col-md-6 mb-4 mb-md-0">
          <h2 className="h3 fw-bold mb-3">Contact Us</h2>
          <form className="vstack gap-3">
            <input
              type="text"
              placeholder="Your Name"
              className="form-control"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="form-control"
              required
            />
            <textarea
              placeholder="Your Message"
              className="form-control"
              rows={4}
              required
            ></textarea>
            <button
              type="submit"
              className="btn btn-primary fw-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <img
            src="https://images.pexels.com/photos/4481321/pexels-photo-4481321.jpeg?auto=compress&w=800&q=80"
            alt="Contact Us"
            className="img-fluid rounded shadow object-fit-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

export default ContactUs; 