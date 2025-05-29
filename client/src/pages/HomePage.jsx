import React from "react";
import Hero from "../components/Hero";
import TrackingForm from "../components/TrackingForm";
import Services from "../components/Services";
import AboutUs from "../components/AboutUs";
import Testimonials from "../components/Testimonials";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
// Import other sections as you build them

const HomePage = () => (
  <div>
    <Hero />
    <TrackingForm />
    <div id="services"><Services /></div>
    <div id="about"><AboutUs /></div>
    <Testimonials />
    <div id="contact"><ContactUs /></div>
    <Footer />
  </div>
);

export default HomePage; 