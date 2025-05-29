import React from "react";

const testimonials = [
  {
    name: "Jane Doe",
    img: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&w=80&q=80",
    quote:
      "The delivery was super fast and my package arrived in perfect condition. Highly recommended!",
  },
  {
    name: "John Smith",
    img: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&w=80&q=80",
    quote:
      "Excellent customer service and reliable tracking. I always use this company for my shipments.",
  },
  {
    name: "Maria Garcia",
    img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&w=80&q=80",
    quote:
      "Their warehousing solutions saved my business time and money. Great team!",
  },
];

const Testimonials = () => (
  <section className="py-5 bg-light">
    <div className="container">
      <h2 className="h3 fw-bold text-center mb-5">What Our Clients Say</h2>
      <div className="row g-4">
        {testimonials.map((t, idx) => (
          <div key={idx} className="col-md-4">
            <div className="card h-100 shadow-sm text-center p-4">
              <img src={t.img} alt={t.name} className="rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
              <p className="fst-italic text-secondary mb-2">"{t.quote}"</p>
              <span className="fw-semibold text-primary">{t.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials; 