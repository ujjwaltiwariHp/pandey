"use client";
import { FaLocationDot, FaPhone, FaFacebook, FaInstagram, FaWhatsapp, FaUser } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Left Column: Premium Business Details */}
        <div className="footer-info">
          <h3>पाण्डेय ट्रेडर्स</h3>
          <p className="footer-desc">गुणवत्तापूर्ण खाद, बीज एवं कृषि रसायन के विश्वसनीय विक्रेता।</p>
          <div className="footer-contact-details">
            <div className="contact-item">
              <FaUser className="contact-icon" />
              <span>रतनेश पाण्डेय</span>
            </div>
            <div className="contact-item">
              <FaLocationDot className="contact-icon" />
              <span>बड़का गांव, गोपालगंज, बिहार</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <a href="tel:+918969730344">+91 8969730344</a>
            </div>
          </div>
          <div className="footer-social">
            <a href="https://www.facebook.com/share/1D1NWRnJez/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/ratnesh_kumar_pandey_?igsh=MTJqa3A2aGU0NDE4aA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://wa.me/918969730344" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Map Widget */}
        <div className="footer-map-container">
          <iframe 
            src="https://maps.google.com/maps?q=26°24'45.1%22N%2084°16'01.4%22E&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0, minHeight: "240px" }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Pandey Traders Location"
          ></iframe>
        </div>
      </div>
      <p className="footer-copy">© 2026 Pandey Traders. All Rights Reserved.</p>
    </footer>
  );
}
