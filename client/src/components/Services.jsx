import React from "react";

const services = [
  {
    title: "Express Delivery",
    img: "/express-delivery-img.jpg",
    desc: "Fast and reliable delivery services for your urgent shipments, anywhere in the world.",
  },
  {
    title: "Warehousing",
    img: "/ware-housing-img.jpg",
    desc: "Secure and modern warehousing solutions to store your goods safely.",
  },
  {
    title: "Freight Forwarding",
    img: "https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&w=800&q=80",
    desc: "Efficient freight forwarding by air, sea, and land for all shipment sizes.",
  },
];

const Services = () => (
  <section className="py-5 bg-light">
    <div className="container">
      <h2 className="h3 fw-bold text-center mb-5">Our Services</h2>
      <div className="row g-4">
        {services.map((service, idx) => (
          <div key={idx} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <img src={service.img} alt={service.title} className="card-img-top object-fit-cover" style={{height: '200px', objectFit: 'cover'}} />
              <div className="card-body">
                <h3 className="h5 fw-semibold mb-2">{service.title}</h3>
                <p className="text-muted">{service.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services; 