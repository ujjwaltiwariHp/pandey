"use client";
import { FaLocationDot, FaPhone, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <h3>पाण्डेय ट्रेडर्स</h3>
        <p>गुणवत्तापूर्ण खाद, बीज एवं कृषि रसायन के विश्वनीय विक्रेता।</p>
        <p className="footer-contact">
          <span><FaLocationDot /> बड़का गांव, गोपालगंज, बिहार</span>
          <span className="footer-divider">|</span>
          <a href="tel:+918969730344"><FaPhone /> +91 8969730344</a>
        </p>
        <div className="footer-social">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaInstagram /></a>
          <a href="https://wa.me/918969730344" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
          </a>
        </div>
        <p className="footer-copy">© 2026 Pandey Traders. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
